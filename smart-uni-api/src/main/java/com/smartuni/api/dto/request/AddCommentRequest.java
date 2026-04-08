package com.smartuni.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddCommentRequest {

    @NotBlank(message = "Comment content is required")
    private String content;

    @NotBlank(message = "Author ID is required")
    private String authorId;

    @NotBlank(message = "Author name is required")
    private String authorName;
}