package com.knowledgeplatform.controller;

import com.knowledgeplatform.dto.request.AiAssistRequest;
import com.knowledgeplatform.dto.response.ApiResponse;
import com.knowledgeplatform.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/assist")
    public ResponseEntity<ApiResponse<String>> assist(@RequestBody AiAssistRequest request) {
        String result;
        switch (request.getType().toUpperCase()) {
            case "SUMMARIZE":
                result = aiService.summarize(request.getContent());
                break;
            case "EXPAND":
                result = aiService.expandBullets(request.getContent());
                break;
            case "SUGGEST_TAGS":
                result = aiService.suggestTags(request.getContent());
                break;
            case "IMPROVE":
                result = aiService.improveContent(request.getContent());
                break;
            case "SUGGEST_TITLE":
                result = aiService.suggestTitle(request.getContent());
                break;
            default:
                result = aiService.getAiAssistance(request.getContent());
        }
        return ResponseEntity.ok(ApiResponse.success(result, "AI assistance provided"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<String>> search(@RequestParam(name = "q") String q) {
        String result = aiService.searchOnline(q);
        return ResponseEntity.ok(ApiResponse.success(result, "Online search results retrieved"));
    }
}
