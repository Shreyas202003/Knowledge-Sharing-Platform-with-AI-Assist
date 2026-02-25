package com.knowledgeplatform.repository;

import com.knowledgeplatform.entity.Article;
import com.knowledgeplatform.entity.Like;
import com.knowledgeplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndArticle(User user, Article article);
    Long countByArticle(Article article);
    Boolean existsByUserAndArticle(User user, Article article);
}
