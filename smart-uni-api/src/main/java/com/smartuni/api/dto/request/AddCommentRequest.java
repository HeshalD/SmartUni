package com.smartuni.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddCommentRequest {

    @NotBlank(message = "Comment content is required")
    private String content;

    private String authorId;

    private String authorName;
}