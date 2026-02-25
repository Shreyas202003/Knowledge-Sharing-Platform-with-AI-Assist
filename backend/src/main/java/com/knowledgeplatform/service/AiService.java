package com.knowledgeplatform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    @Value("${app.ai.gemini.api-key}")
    private String geminiApiKey;

    @Value("${app.ai.gemini.model:gemini-2.0-flash}")
    private String geminiModel;

    @Value("${app.ai.gemini.base-url:https://generativelanguage.googleapis.com/v1/models}")
    private String geminiBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public String getAiAssistance(String prompt) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return "AI assistance is currently unavailable (API Key missing).";
        }

        String modelName = geminiModel.trim();
        String baseUrl = geminiBaseUrl.trim();
        String apiKey = geminiApiKey.trim();

        // Using URI template to avoid encoding issues with the colon
        String url = baseUrl + "/{model}:generateContent?key={key}";

        log.info("Calling Gemini API on model: {}", modelName);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)))));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // HARDCODED TEST TO RULE OUT VARIABLE ISSUES
        String testUrl = "https://generativelanguage.googleapis.com/v1/models/" + modelName
                + ":generateContent?key=" + apiKey;
        log.info("DIAGNOSTIC - Calling hardcoded URL: {}", testUrl.substring(0, Math.min(testUrl.length(), 50)));

        Map<String, Object> response = restTemplate.postForObject(
                testUrl,
                entity,
                Map.class);

        if (response == null) {
            log.error("Received null response from Gemini API");
            throw new RuntimeException("AI service returned an empty response.");
        }
        return extractResponseText(response);
    }

    public String searchOnline(String query) {
        String prompt = "Act as a technical knowledge assistant. Provide a high-quality technical summary about '"
                + query
                + "' from online sources. Focus on architecture, best practices, and trends. Output in markdown format.";
        return getAiAssistance(prompt);
    }

    public String summarize(String content) {
        String prompt = "Summarize the following technical article in 2-3 concise sentences. Content: " + content;
        return getAiAssistance(prompt);
    }

    public String expandBullets(String bullets) {
        String prompt = "Expand the following bullet points into a professional, well-structured paragraph for a technical article: "
                + bullets;
        return getAiAssistance(prompt);
    }

    public String suggestTags(String content) {
        String prompt = "Suggest 3-5 technical tags (comma-separated) for the following content. Only return the tags: "
                + content;
        return getAiAssistance(prompt);
    }

    public String improveContent(String content) {
        String prompt = "Rewrite the following technical content to be clearer, more concise, and grammatically perfect, while maintaining its professional tone. Focus on technical accuracy: "
                + content;
        return getAiAssistance(prompt);
    }

    public String suggestTitle(String content) {
        String prompt = "Based on the following technical content, suggest a compelling, high-signal, and SEO-friendly title that would appeal to software engineers and tech leaders. Only return the title: "
                + content;
        return getAiAssistance(prompt);
    }

    @SuppressWarnings("unchecked")
    private String extractResponseText(Map<String, Object> response) {
        try {
            if (response.containsKey("error")) {
                Map<String, Object> error = (Map<String, Object>) response.get("error");
                return "AI Error: " + error.get("message");
            }
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                log.warn("No candidates returned from Gemini. Full response: {}", response);
                return "AI provided no suggestions for this content.";
            }
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                return "AI provided no text for this content.";
            }
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            log.error("Failed to parse AI response: {}", response, e);
            return "Failed to parse AI response: " + e.getMessage();
        }
    }
}
