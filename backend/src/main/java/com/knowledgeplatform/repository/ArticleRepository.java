package com.knowledgeplatform.repository;

import com.knowledgeplatform.entity.Article;
import com.knowledgeplatform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Optional<Article> findBySlug(@org.springframework.data.repository.query.Param("slug") String slug);

    Page<Article> findAllByStatus(@org.springframework.data.repository.query.Param("status") Article.Status status,
            Pageable pageable);

    Page<Article> findAllByStatusAndCategory(
            @org.springframework.data.repository.query.Param("status") Article.Status status,
            @org.springframework.data.repository.query.Param("category") String category,
            Pageable pageable);

    Page<Article> findAllByAuthor(@org.springframework.data.repository.query.Param("author") User author,
            Pageable pageable);

    @Modifying
    @Query("UPDATE Article a SET a.viewCount = a.viewCount + 1 WHERE a.id = :id")
    void incrementViewCount(@org.springframework.data.repository.query.Param("id") Long id);

    @Query("SELECT a FROM Article a WHERE a.status = 'PUBLISHED' AND (" +
            "a.title LIKE %:query% OR " +
            "a.contentHtml LIKE %:query% OR " +
            "a.tags LIKE %:query% OR " +
            "a.category LIKE %:query%)")
    Page<Article> searchArticles(@org.springframework.data.repository.query.Param("query") String query,
            Pageable pageable);
}
