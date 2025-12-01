package com.pharmacyinventory.config;

import com.pharmacyinventory.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(UserService userService) {
        return username -> userService.getUserByUsername(username)
                .map(user -> org.springframework.security.core.userdetails.User.builder()
                        .username(user.getUsername())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/auth/**", "/", "/login", "/register", "/css/**", "/js/**", "/images/**").permitAll()
                        .requestMatchers("/medicines", "/suppliers", "/sales", "/orders", "/deliveries", "/billing").permitAll()
                        .requestMatchers("/reports", "/users").authenticated()
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/medicines/**", "/api/suppliers/**", "/api/sales/**", "/api/reports/**").hasAnyRole("PHARMACIST", "ADMIN")
                        .requestMatchers("/api/orders/**", "/api/deliveries/**", "/api/billing/**").hasAnyRole("PHARMACIST", "DELIVERY_STAFF", "ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin().loginPage("/login").defaultSuccessUrl("/", true)
                .and()
                .logout().logoutSuccessUrl("/")
                .and()
                .sessionManagement().maximumSessions(1);

        return http.build();
    }
}
