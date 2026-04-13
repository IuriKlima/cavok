package br.com.cavokavionics.api.controller.admin;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/upload")
public class AdminUploadController {

    @Value("${upload.dir}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<Map<String, Object>> upload(@RequestParam("files") MultipartFile[] files) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalName = file.getOriginalFilename();
            String extension = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";
            String fileName = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Verificação de Magic Bytes
            try (java.io.InputStream is = Files.newInputStream(filePath)) {
                byte[] header = new byte[8];
                if (is.read(header) < 4 || !isValidImage(header)) {
                    is.close();
                    Files.delete(filePath);
                    return ResponseEntity.status(400).body(Map.of("error", "Arquivo inválido ou corrompido: " + originalName));
                }
            }

            urls.add("/uploads/" + fileName);
        }

        return ResponseEntity.ok(Map.of(
            "urls", urls,
            "message", urls.size() + " arquivo(s) enviado(s) com sucesso"
        ));
    }

    private boolean isValidImage(byte[] bytes) {
        if (bytes.length < 8) return false;
        // JPEG (FF D8 FF)
        if (bytes[0] == (byte)0xFF && bytes[1] == (byte)0xD8 && bytes[2] == (byte)0xFF) return true;
        // PNG (89 50 4E 47)
        if (bytes[0] == (byte)0x89 && bytes[1] == (byte)0x50 && bytes[2] == (byte)0x4E && bytes[3] == (byte)0x47) return true;
        // GIF (47 49 46 38)
        if (bytes[0] == (byte)0x47 && bytes[1] == (byte)0x49 && bytes[2] == (byte)0x46 && bytes[3] == (byte)0x38) return true;
        // WEBP (RIFF)
        if (bytes[0] == (byte)0x52 && bytes[1] == (byte)0x49 && bytes[2] == (byte)0x46 && bytes[3] == (byte)0x46) return true;
        return false;
    }
}
