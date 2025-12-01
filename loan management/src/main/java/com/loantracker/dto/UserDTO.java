package com.loantracker.dto;

import lombok.Data;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class UserDTO {
    private Long userId;
    
    @NotBlank(message = "Name is required")
    @Size(max = 50, message = "Name must be less than 50 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;
    
    @Size(max = 20, message = "Contact number must be less than 20 characters")
    private String contactNo;
}
