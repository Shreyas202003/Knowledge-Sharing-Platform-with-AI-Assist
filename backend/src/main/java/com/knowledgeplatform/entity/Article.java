package com.knowledgeplatform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "articles", indexes = {
        @Index(name = "idx_article_slug", columnList = "slug"),
        @Index(name = "idx_article_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String contentHtml;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(length = 50)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "view_count")
    @Builder.Default
    private Long viewCount = 0L;

    public enum Status {
        DRAFT, PUBLISHED
    }
}
