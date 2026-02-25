package com.knowledgeplatform.dto.request;

import lombok.Data;

@Data
public class AiAssistRequest {
    private String content;
    private String type; // SUMMARIZE, EXPAND, SUGGEST_TAGS
}
