package br.com.cavokavionics.api.controller.admin;

import br.com.cavokavionics.api.model.Usuario;
import br.com.cavokavionics.api.repository.UsuarioRepository;
import br.com.cavokavionics.api.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail()).orElse(null);

        if (usuario == null || !passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            return ResponseEntity.status(401).body(Map.of("error", "Email ou senha inválidos"));
        }

        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRole().name());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "nome", usuario.getNome(),
            "email", usuario.getEmail(),
            "role", usuario.getRole().name()
        ));
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        @NotBlank
        private String senha;
    }
}
