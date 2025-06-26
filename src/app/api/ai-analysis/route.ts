import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyData } = body;

    if (!propertyData) {
      return NextResponse.json(
        { error: 'Property data is required' },
        { status: 400 }
      );
    }

    const prompt = `
You are a real estate investment advisor with expertise in property analysis. 
Please analyze the following property and provide investment advice:

Property Details:
- Name: ${propertyData.name}
- Address: ${propertyData.address}
- Type: ${propertyData.type}
- Current Value: $${propertyData.value?.toLocaleString() || 'N/A'}
- Status: ${propertyData.status}

Please provide:
1. Investment Potential (High/Medium/Low)
2. Key Strengths
3. Potential Risks
4. Market Position
5. Investment Recommendation
6. Expected ROI Range
7. Best Use Case (Rental/Flip/Long-term Investment)

Keep your response professional, concise, and actionable. Focus on practical investment advice.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional real estate investment advisor. Provide clear, actionable advice based on property data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const analysis = completion.choices[0]?.message?.content;

    return NextResponse.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze property' },
      { status: 500 }
    );
  }
} 