import { NextRequest, NextResponse } from 'next/server'

const API_TOKEN = process.env.REPLICATE_API_TOKEN
const BASE_URL = 'https://api.replicate.com/v1'

async function pollForResults(predictionId: string): Promise<any> {
  const maxAttempts = 120 // 10 minutes with 5s intervals
  let attempts = 0

  while (attempts < maxAttempts) {
    const response = await fetch(`${BASE_URL}/predictions/${predictionId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to poll for results')
    }

    const result = await response.json()

    if (result.status === 'succeeded') {
      return result
    }

    if (result.status === 'failed') {
      throw new Error(result.error || 'Prediction failed')
    }

    // Wait 5 seconds before polling again
    await new Promise(resolve => setTimeout(resolve, 5000))
    attempts++
  }

  throw new Error('Prediction timed out')
}

export async function POST(request: NextRequest) {
  try {
    const { actorName, productName, actorImageBase64, productImageBase64 } = await request.json()

    if (!actorName || !productName) {
      return NextResponse.json({ error: 'Actor and product are required' }, { status: 400 })
    }

    if (!actorImageBase64) {
      return NextResponse.json({ error: 'Actor image is required' }, { status: 400 })
    }

    if (!productImageBase64) {
      return NextResponse.json({ error: 'Product image is required' }, { status: 400 })
    }

    if (!API_TOKEN) {
      return NextResponse.json({ error: 'API token not configured' }, { status: 500 })
    }

    // Create UGC-style prompt
    const prompt = `Create a UGC-style vertical video thumbnail of ${actorName} in a cozy modern living room, holding and presenting a ${productName}. Natural lighting, authentic casual setting, friendly expression, looking at camera. Professional but relatable UGC content creator aesthetic. covered under intense, direct midday sun from high above, creating high-contrast, razor-sharp shadows and bright, brilliant highlights. With green elements`

    // Ensure images are proper data URIs
    const actorImageUri = actorImageBase64.startsWith('data:') 
      ? actorImageBase64 
      : `data:image/jpeg;base64,${actorImageBase64}`

    const productImageUri = productImageBase64.startsWith('data:') 
      ? productImageBase64 
      : `data:image/png;base64,${productImageBase64}`

    // Start the prediction with 9:16 aspect ratio for vertical video
    const startResponse = await fetch(`${BASE_URL}/models/bytedance/seedream-4.5/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          size: '4K',
          width: 1152,
          height: 2048,
          prompt: prompt,
          max_images: 1,
          image_input: [actorImageUri, productImageUri],
          aspect_ratio: '9:16',
          sequential_image_generation: 'disabled'
        }
      })
    })

    if (!startResponse.ok) {
      const errorData = await startResponse.text()
      console.error('Seedream API error:', errorData)
      return NextResponse.json({ error: 'Failed to start prediction' }, { status: 500 })
    }

    const startData = await startResponse.json()
    const predictionId = startData.id

    // Poll for results
    const result = await pollForResults(predictionId)

    // Extract output URL
    const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output

    return NextResponse.json({ 
      outputUrl,
      prompt 
    })
  } catch (error) {
    console.error('UGC creation error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create UGC image' 
    }, { status: 500 })
  }
}
