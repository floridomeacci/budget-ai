import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceImageUrl } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: 'Replicate API token not configured' }, { status: 500 })
    }

    // Build the input object for Veo 3.1
    const input: {
      prompt: string
      duration: number
      resolution: string
      aspect_ratio: string
      generate_audio: boolean
      reference_images?: { value: string }[]
    } = {
      prompt,
      duration: 8,
      resolution: '1080p',
      aspect_ratio: '9:16',
      generate_audio: true,
    }

    // Add reference image if provided
    if (referenceImageUrl) {
      input.reference_images = [{ value: referenceImageUrl }]
    }

    // Create prediction
    const createResponse = await fetch('https://api.replicate.com/v1/models/google/veo-3.1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    })

    const prediction = await createResponse.json()

    if (!createResponse.ok) {
      console.error('Replicate API error:', prediction)
      return NextResponse.json({ 
        error: prediction.detail || prediction.error || 'Failed to start video generation' 
      }, { status: createResponse.status })
    }

    // Poll for completion
    let result = prediction
    const maxAttempts = 120 // 10 minutes max (5 second intervals)
    let attempts = 0

    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
      
      const pollResponse = await fetch(result.urls.get, {
        headers: {
          'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
        },
      })
      
      result = await pollResponse.json()
      attempts++
      
      console.log(`Video generation status: ${result.status} (attempt ${attempts})`)
    }

    if (result.status === 'failed') {
      return NextResponse.json({ 
        error: result.error || 'Video generation failed' 
      }, { status: 500 })
    }

    if (result.status !== 'succeeded') {
      return NextResponse.json({ 
        error: 'Video generation timed out' 
      }, { status: 504 })
    }

    // The output should be the video URL
    const outputUrl = result.output

    if (!outputUrl) {
      return NextResponse.json({ error: 'No video generated' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      outputUrl,
      id: result.id
    })

  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate video' 
    }, { status: 500 })
  }
}
