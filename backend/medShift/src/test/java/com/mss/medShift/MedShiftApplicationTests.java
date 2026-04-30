package com.mss.medShift;

import java.util.Map;

import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestRestTemplate
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@TestMethodOrder(OrderAnnotation.class)
class MedShiftApplicationTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    @Order(1)
    void cadastroHospitalLoginHospitalCadastroSetorCadastroManager() {
        var hospitalEmail = "hospital-test@example.com";
        var hospitalPassword = "senha123";

        createHospital(hospitalEmail, hospitalPassword);
        var hospitalToken = loginAndGetToken(hospitalEmail, hospitalPassword);

        var setorId = createSetor(hospitalToken, "Cardiologia", "Setor de Cardiologia");
        createManager(hospitalToken, setorId, "Maria Souza", "09876543210", "maria.manager@example.com", "senha456", "Cardiologia");
    }

    @Test
    @Order(2)
    void loginManager() {
        var hospitalEmail = "hospital-test2@example.com";
        var hospitalPassword = "senha123";

        createHospital(hospitalEmail, hospitalPassword);
        var hospitalToken = loginAndGetToken(hospitalEmail, hospitalPassword);

        var setorId = createSetor(hospitalToken, "Neurologia", "Setor de Neurologia");
        createManager(hospitalToken, setorId, "Carlos Silva", "09876543211", "carlos.manager@example.com", "senha789", "Neurologia");

        var managerLogin = login("carlos.manager@example.com", "senha789");
        assertThat(managerLogin).containsKey("token");
        assertThat(managerLogin.get("token")).isInstanceOf(String.class);
    }

    @Test
    @Order(3)
    void cadastroDoctorLoginDoctor() {
        var doctorEmail = "doctor-test@example.com";
        var doctorPassword = "senha123";

        createDoctor(doctorEmail, doctorPassword, "João Silva", "12345678900", "1990-01-01", "Cardiologia", "12345");

        var doctorLogin = login(doctorEmail, doctorPassword);
        assertThat(doctorLogin).containsKey("token");
        assertThat(doctorLogin.get("token")).isInstanceOf(String.class);
    }

    private void createHospital(String email, String password) {
        String cnpjSuffix = String.format("%04d", Math.abs(email.hashCode()) % 10000);
        var hospitalRequest = Map.of(
                "nomeFantasia", "Hospital Teste",
                "cnpj", "12345678" + cnpjSuffix + "99",
                "endereco", "Av. Teste, 100",
                "nomeGestor", "Gestor Teste",
                "email", email,
                "password", password
        );

        ResponseEntity<Map> response = restTemplate.postForEntity("/hospital", hospitalRequest, Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).containsEntry("email", email);
    }

    private Long createSetor(String token, String nome, String descricao) {
        var headers = new HttpHeaders();
        headers.setBearerAuth(token);

        var setorRequest = Map.of(
                "nome", nome,
                "descricao", descricao
        );

        ResponseEntity<Map> response = restTemplate.exchange(
                "/setor",
                HttpMethod.POST,
                new HttpEntity<>(setorRequest, headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        return ((Number) response.getBody().get("id")).longValue();
    }

    private void createManager(String token, Long setorId, String name, String cpf, String email, String password, String department) {
        var headers = new HttpHeaders();
        headers.setBearerAuth(token);

        var managerRequest = Map.of(
                "name", name,
                "cpf", cpf,
                "email", email,
                "birthday", "1985-05-15",
                "password", password,
                "department", department,
                "setor", Map.of("id", setorId)
        );

        ResponseEntity<Map> response = restTemplate.exchange(
                "/manager",
                HttpMethod.POST,
                new HttpEntity<>(managerRequest, headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).containsEntry("email", email);
    }

    private void createDoctor(String email, String password, String name, String cpf, String birthday, String specialty, String crm) {
        var doctorRequest = Map.of(
                "name", name,
                "cpf", cpf,
                "email", email,
                "birthday", birthday,
                "password", password,
                "specialty", specialty,
                "crm", crm
        );

        ResponseEntity<Map> response = restTemplate.postForEntity("/doctor/register", doctorRequest, Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).containsEntry("email", email);
    }

    private Map<String, Object> login(String email, String password) {
        var loginRequest = Map.of(
                "email", email,
                "password", password
        );

        ResponseEntity<Map> response = restTemplate.postForEntity("/auth/login", loginRequest, Map.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }

    private String loginAndGetToken(String email, String password) {
        return (String) login(email, password).get("token");
    }
}
