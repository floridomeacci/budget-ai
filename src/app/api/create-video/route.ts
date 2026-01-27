import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceImageUrl, duration = 8 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

    if (!REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: 'Replicate API token not configured' }, { status: 500 })
    }

    // Build the input object
    const input: {
      prompt: string
      duration: number
      resolution: string
      aspect_ratio: string
      generate_audio: boolean
      reference_images?: { value: string }[]
    } = {
      prompt,
      duration,
      resolution: '1080p',
      aspect_ratio: '9:16',
      generate_audio: true,
    }

    // Add reference image if provided
    if (referenceImageUrl) {
      input.reference_images = [{ value: referenceImageUrl }]
    }

    // Call Replicate API for Veo 3.1
    const response = await fetch('https://api.replicate.com/v1/models/google/veo-3.1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait',
      },
      body: JSON.stringify({ input }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Replicate API error:', data)
      return NextResponse.json({ 
        error: data.detail || data.error || 'Failed to generate video' 
      }, { status: response.status })
    }

    // The output should be the video URL
    const outputUrl = data.output

    if (!outputUrl) {
      return NextResponse.json({ error: 'No video generated' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      outputUrl,
      id: data.id
    })

  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate video' 
    }, { status: 500 })
  }
}
