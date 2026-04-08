package com.smartuni.api.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("SmartUni Password Reset OTP");
        message.setText(
                "Your SmartUni password reset OTP is: " + otp + "\n\n" +
                "This OTP will expire in 10 minutes."
        );

        mailSender.send(message);
    }
}