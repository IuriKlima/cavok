package br.com.cavokavionics.api.controller.admin;

import br.com.cavokavionics.api.service.XmlImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/import")
@RequiredArgsConstructor
public class AdminImportController {

    private final XmlImportService xmlImportService;

    @PostMapping("/xml")
    public ResponseEntity<Map<String, Object>> importarXml(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> resultado = xmlImportService.importarXml(file.getInputStream());
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erro ao importar: " + e.getMessage()));
        }
    }
}
