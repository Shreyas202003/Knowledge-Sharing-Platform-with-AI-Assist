package com.knowledgeplatform.controller;

import com.knowledgeplatform.dto.request.ArticleCreateRequest;
import com.knowledgeplatform.dto.response.ApiResponse;
import com.knowledgeplatform.dto.response.ArticleResponse;
import com.knowledgeplatform.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    public ResponseEntity<ApiResponse<ArticleResponse>> createArticle(
            @Valid @RequestBody ArticleCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                articleService.createArticle(request),
                "Article created successfully"));
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<Page<ArticleResponse>>> getPublicArticles(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "category", required = false) String category,
            @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                articleService.getPublicArticles(title, category, pageable),
                "Articles retrieved successfully"));
    }

    @GetMapping("/public/{slug}")
    public ResponseEntity<ApiResponse<ArticleResponse>> getArticleBySlug(@PathVariable(name = "slug") String slug) {
        return ResponseEntity.ok(ApiResponse.success(
                articleService.getArticleBySlug(slug),
                "Article retrieved successfully"));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<Page<ArticleResponse>>> getMyArticles(
            @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                articleService.getMyArticles(pageable),
                "My articles retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ArticleResponse>> updateArticle(
            @PathVariable(name = "id") Long id,
            @Valid @RequestBody ArticleCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                articleService.updateArticle(id, request),
                "Article updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteArticle(@PathVariable(name = "id") Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Article deleted successfully"));
    }
}
