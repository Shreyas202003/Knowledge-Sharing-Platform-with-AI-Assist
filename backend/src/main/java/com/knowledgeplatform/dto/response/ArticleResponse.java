package com.knowledgeplatform.dto.response;

import com.knowledgeplatform.entity.Article;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArticleResponse {
    private Long id;
    private String title;
    private String slug;
    private String contentHtml;
    private Article.Status status;
    private String coverImage;
    private String category;
    private String tags;
    private String summary;
    private Long viewCount;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
