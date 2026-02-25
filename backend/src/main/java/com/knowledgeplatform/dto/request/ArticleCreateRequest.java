package com.knowledgeplatform.dto.request;

import com.knowledgeplatform.entity.Article;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ArticleCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String contentHtml;

    private String coverImage;

    @NotBlank(message = "Category is required")
    private String category;

    private String tags; // Comma separated

    @NotNull(message = "Status is required")
    private Article.Status status;
}
