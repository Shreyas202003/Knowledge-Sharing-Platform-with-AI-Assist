package com.knowledgeplatform.service;

import com.knowledgeplatform.dto.request.ArticleCreateRequest;
import com.knowledgeplatform.dto.response.ArticleResponse;
import com.knowledgeplatform.entity.Article;
import com.knowledgeplatform.entity.User;
import com.knowledgeplatform.repository.ArticleRepository;
import com.knowledgeplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    @Transactional
    public ArticleResponse createArticle(ArticleCreateRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User author = userRepository.findByUsername(username).orElseThrow();

        String slug = generateSlug(request.getTitle());

        Article article = Article.builder()
                .title(request.getTitle())
                .slug(slug)
                .contentHtml(request.getContentHtml())
                .category(request.getCategory())
                .tags(request.getTags())
                .summary(generateSummary(request.getContentHtml()))
                .status(request.getStatus())
                .coverImage(request.getCoverImage())
                .author(author)
                .build();

        Article savedArticle = articleRepository.save(article);
        return mapToResponse(savedArticle);
    }

    @Transactional
    public ArticleResponse getArticleBySlug(String slug) {
        Article article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        // Only allow viewing published articles via the slug for public access
        if (article.getStatus() != Article.Status.PUBLISHED) {
            throw new RuntimeException("Article not found");
        }

        articleRepository.incrementViewCount(article.getId());
        return mapToResponse(article);
    }

    public Page<ArticleResponse> getPublicArticles(String query, String category, Pageable pageable) {
        if (query != null && !query.trim().isEmpty()) {
            return articleRepository.searchArticles(query, pageable)
                    .map(this::mapToResponse);
        }
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) {
            return articleRepository.findAllByStatusAndCategory(Article.Status.PUBLISHED, category, pageable)
                    .map(this::mapToResponse);
        }
        return articleRepository.findAllByStatus(Article.Status.PUBLISHED, pageable)
                .map(this::mapToResponse);
    }

    public Page<ArticleResponse> getMyArticles(Pageable pageable) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User author = userRepository.findByUsername(username).orElseThrow();
        return articleRepository.findAllByAuthor(author, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public ArticleResponse updateArticle(Long id, ArticleCreateRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("Updating article ID: {} for user: {}", id, username);
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Article NOT FOUND with ID: {}", id);
                    return new RuntimeException("Article not found");
                });

        if (!article.getAuthor().getUsername().equals(username)) {
            log.error("User {} is NOT AUTHORIZED to edit article {} by {}", username, id,
                    article.getAuthor().getUsername());
            throw new RuntimeException("You are not authorized to edit this article");
        }

        article.setTitle(request.getTitle());
        article.setContentHtml(request.getContentHtml());
        article.setCategory(request.getCategory());
        article.setTags(request.getTags());
        article.setSummary(generateSummary(request.getContentHtml()));
        article.setCoverImage(request.getCoverImage());
        article.setStatus(request.getStatus());

        return mapToResponse(articleRepository.save(article));
    }

    @Transactional
    public void deleteArticle(Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        if (!article.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this article");
        }

        articleRepository.delete(article);
    }

    private String generateSlug(String input) {
        if (input == null || input.isEmpty())
            return "";
        String nowhitespace = input.replaceAll("\\s+", "-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(normalized).replaceAll("")
                .toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9-]", "");

        // Ensure uniqueness if needed - simplified for now
        return slug + "-" + System.currentTimeMillis() % 1000;
    }

    private ArticleResponse mapToResponse(Article article) {
        return ArticleResponse.builder()
                .id(article.getId())
                .title(article.getTitle())
                .slug(article.getSlug())
                .contentHtml(article.getContentHtml())
                .status(article.getStatus())
                .coverImage(article.getCoverImage())
                .category(article.getCategory())
                .tags(article.getTags())
                .summary(article.getSummary())
                .viewCount(article.getViewCount())
                .authorName(article.getAuthor().getUsername())
                .createdAt(article.getCreatedAt())
                .updatedAt(article.getUpdatedAt())
                .build();
    }

    private String generateSummary(String html) {
        if (html == null)
            return "";
        // Simple HTML strip to create a plain text summary
        String plainText = html.replaceAll("<[^>]*>", " ")
                .replaceAll("\\s+", " ")
                .trim();
        if (plainText.length() > 150) {
            return plainText.substring(0, 147) + "...";
        }
        return plainText;
    }
}
