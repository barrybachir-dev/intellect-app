import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }

const toBase64 = (bytes: Uint8Array) => {
  let binary = ''
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return btoa(binary)
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  let resumeId: string | undefined
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) throw new Error('Authentification requise.')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    )
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('Session invalide.')

    const requestBody = await request.json()
    const mode = ['summary', 'quiz', 'notes', 'all'].includes(requestBody?.mode) ? requestBody.mode : 'all'
    resumeId = requestBody?.resumeId || requestBody?.id
    if (!resumeId) throw new Error('Identifiant de document manquant.')
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('id, title, source_path')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()
    if (resumeError || !resume) throw new Error('Document introuvable.')

    const { data: file, error: fileError } = await supabase.storage.from('documents').download(resume.source_path)
    if (fileError || !file) throw new Error('Impossible de lire le PDF.')

    const pdfData = `data:application/pdf;base64,${toBase64(new Uint8Array(await file.arrayBuffer()))}`
    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiKey) throw new Error('GEMINI_API_KEY n’est pas configuree.')

    const geminiModel = 'gemini-3.6-flash'
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType: 'application/pdf', data: pdfData.split(',')[1] } },
            { text: 'Produis un resume pedagogique en francais et un quiz de 5 questions. Reponds uniquement avec le JSON demande.' },
          ],
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
              type: 'OBJECT',
              properties: {
                subject: { type: 'STRING' },
                page_count: { type: 'INTEGER' },
                content: { type: 'STRING' },
                keypoints: { type: 'ARRAY', items: { type: 'STRING' } },
                questions: {
                  type: 'ARRAY', items: {
                    type: 'OBJECT',
                    properties: {
                      q: { type: 'STRING' },
                      options: { type: 'ARRAY', items: { type: 'STRING' }, minItems: 4, maxItems: 4 },
                      answer: { type: 'INTEGER', minimum: 0, maximum: 3 },
                    },
                    required: ['q', 'options', 'answer'],
                  },
                  minItems: 5,
                  maxItems: 5,
                },
              },
              required: ['subject', 'page_count', 'content', 'keypoints', 'questions'],
            },
          },
      }),
    })
    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text().catch(() => '')
      const normalized = errorBody ? ` ${errorBody}` : ''
      throw new Error(`Gemini a refuse le traitement (${geminiResponse.status}). Vérifie que l'API Generative Language est activée et que le modèle ${geminiModel} est disponible pour ce projet.${normalized}`)
    }

    const geminiData = await geminiResponse.json()
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
    if (!responseText) throw new Error('La reponse Gemini est vide.')
    const result = JSON.parse(responseText)
    const { error: updateError } = await supabase.from('resumes').update({
      subject: result.subject,
      page_count: result.page_count,
      content: result.content,
      keypoints: result.keypoints,
      status: 'ready',
    }).eq('id', resume.id)
    if (updateError) throw updateError

    let generatedNote
    if (mode === 'quiz' || mode === 'all') {
      const { error: quizError } = await supabase.from('quizzes').insert({
        user_id: user.id,
        resume_id: resume.id,
        title: `Quiz : ${resume.title}`,
        questions: result.questions,
      })
      if (quizError) throw quizError
    }
    if (mode === 'notes' || mode === 'all') {
      const { data: note, error: noteError } = await supabase.from('notes').insert({
        user_id: user.id,
        title: `Fiche : ${resume.title}`,
        subject: result.subject,
        content: result.content,
      }).select().single()
      if (noteError) throw noteError
      generatedNote = { ...note, date: new Date(note.created_at).toLocaleDateString('fr-FR') }
    }

    return new Response(JSON.stringify({ success: true, generatedNote }), { headers: jsonHeaders })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue.'
    if (resumeId) {
      await supabaseAdminUpdate(resumeId, errorMessage)
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 400, headers: jsonHeaders })
  }
})

async function supabaseAdminUpdate(resumeId: string, errorMessage: string) {
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  if (!serviceRoleKey || !supabaseUrl) return
  await fetch(`${supabaseUrl}/rest/v1/resumes?id=eq.${resumeId}`, {
    method: 'PATCH',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ status: 'failed', error_message: errorMessage }),
  })
}