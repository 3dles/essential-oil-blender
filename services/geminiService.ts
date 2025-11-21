
import { GoogleGenAI } from "@google/genai";
import { CompositionResult } from '../types';
import { getApiKey } from '../utils/storage';

export async function analyzeBlend(composition: CompositionResult[]): Promise<string> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("API Key가 설정되지 않았습니다. 우측 상단 설정 버튼을 눌러 API Key를 입력해주세요.");
  }

  // Initialize the client dynamically with the stored key
  const ai = new GoogleGenAI({ apiKey });

  const compositionString = composition
    .map(c => `${c.name}: ${c.value}%`)
    .join(', ');

  const prompt = `
    다음은 에센셜 오일 블렌드의 화학적 구성 비율입니다.
    이 구성을 기반으로 블렌드를 전문가처럼 분석해주세요.

    분석 내용은 다음을 포함해야 합니다:
    1.  **주요 화학 성분**: 가장 비율이 높은 3-4가지 성분을 언급하고 각각의 일반적인 특징을 설명해주세요.
    2.  **예상되는 아로마 프로필**: 이 화학 구성이 만들어낼 가능성이 높은 향기(예: 플로럴, 시트러스, 허브, 우디 등)를 묘사해주세요.
    3.  **예상되는 시너지 효과 및 특성**: 성분들이 조합되었을 때 기대할 수 있는 긍정적 효과(예: 안정감, 활력, 집중력 향상 등)를 설명해주세요.
    4.  **사용 시 주의사항**: 특정 성분의 비율이 높을 때 고려해야 할 점(예: 피부 자극 가능성)이 있다면 언급해주세요.

    분석 결과는 마크다운 형식을 사용하여 명확하고 읽기 쉽게 작성해주세요. 모든 답변은 한국어로 제공해야 합니다.

    **화학 구성:**
    ${compositionString}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text || "분석 결과를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Error analyzing blend with Gemini API:", error);
    throw new Error("Gemini API 요청에 실패했습니다. API Key가 올바른지 확인하거나 잠시 후 다시 시도해주세요.");
  }
}
