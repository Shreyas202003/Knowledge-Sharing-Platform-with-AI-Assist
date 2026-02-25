package com.knowledgeplatform.security;

import com.knowledgeplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

        private final UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                com.knowledgeplatform.entity.User user = userRepository.findByUsername(username)
                                .orElseGet(() -> userRepository.findByEmail(username)
                                                .orElseThrow(() -> new UsernameNotFoundException(
                                                                "User not found with username or email: " + username)));

                return User.builder()
                                .username(user.getUsername())
                                .password(user.getPassword())
                                .roles(user.getRole().name())
                                .build();
        }
}
