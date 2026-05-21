package com.mss.medShift;

import java.util.List;
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

        var doctorId = createDoctor(doctorEmail, doctorPassword, "João Silva", "12345678900", "1990-01-01", "Cardiologia", "12345");

        var doctorLogin = login(doctorEmail, doctorPassword);
        assertThat(doctorLogin).containsKey("token");
        assertThat(doctorLogin.get("token")).isInstanceOf(String.class);

        var doctorToken = (String) doctorLogin.get("token");
        var headers = new HttpHeaders();
        headers.setBearerAuth(doctorToken);

        ResponseEntity<Map> myProfileResponse = restTemplate.exchange(
                "/doctor/me",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
        );
        assertThat(myProfileResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(myProfileResponse.getBody()).containsEntry("email", doctorEmail);

        ResponseEntity<Map> adminOnlyDoctorResponse = restTemplate.exchange(
                "/doctor/" + doctorId,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
        );
        assertThat(adminOnlyDoctorResponse.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @Order(4)
    void hospitalNaoAcessaEndpointsAdministrativos() {
        var hospitalId = createHospital("hospital-admin-scope@example.com", "senha123");
        var hospitalToken = loginAndGetToken("hospital-admin-scope@example.com", "senha123");

        var headers = new HttpHeaders();
        headers.setBearerAuth(hospitalToken);

        ResponseEntity<Map> hospitalAdminResponse = restTemplate.exchange(
                "/hospital/" + hospitalId,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
        );
        assertThat(hospitalAdminResponse.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);

        ResponseEntity<Map> setorByHospitalResponse = restTemplate.exchange(
                "/setor/hospital/" + hospitalId,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
        );
        assertThat(setorByHospitalResponse.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @Order(5)
    void hospitalNaoAcessaSetorDeOutroHospital() {
        createHospital("hospital-owner@example.com", "senha123");
        var ownerToken = loginAndGetToken("hospital-owner@example.com", "senha123");
        var setorId = createSetor(ownerToken, "Pediatria", "Setor de Pediatria");
        var managerId = createManager(ownerToken, setorId, "Ana Manager", "09876543212",
                "ana.manager@example.com", "senha456", "Pediatria");

        createHospital("hospital-intruder@example.com", "senha123");
        var intruderToken = loginAndGetToken("hospital-intruder@example.com", "senha123");

        var headers = new HttpHeaders();
        headers.setBearerAuth(intruderToken);

        ResponseEntity<Map> getResponse = restTemplate.exchange(
                "/setor/" + setorId,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
        );
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

        var updateRequest = Map.of("nome", "Nome indevido");
        ResponseEntity<Map> updateResponse = restTemplate.exchange(
                "/setor/" + setorId,
                HttpMethod.PUT,
                new HttpEntity<>(updateRequest, headers),
                Map.class
        );
        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);

        ResponseEntity<Map> managerResponse = restTemplate.exchange(
                "/manager/" + managerId,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class
        );
        assertThat(managerResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @Order(6)
    void hospitalVinculaEDesvinculaEscalistaASetores() {
        var hospitalEmail = "hospital-link-manager@example.com";
        var hospitalPassword = "senha123";

        createHospital(hospitalEmail, hospitalPassword);
        var hospitalToken = loginAndGetToken(hospitalEmail, hospitalPassword);

        var setorInicialId = createSetor(hospitalToken, "UTI", "Unidade de Terapia Intensiva");
        var setorExtraId = createSetor(hospitalToken, "Emergência", "Setor de Emergência");
        var managerId = createManager(hospitalToken, setorInicialId, "Bruno Escalista", "09876543213",
                "bruno.manager@example.com", "senha456", "Escalas");

        var vinculosIniciais = getManagerSetores(hospitalToken, managerId);
        assertThat(vinculosIniciais)
                .extracting(vinculo -> ((Number) ((Map<?, ?>) vinculo).get("setorId")).longValue())
                .contains(setorInicialId);

        var vinculoCriado = vincularManagerSetor(hospitalToken, managerId, setorExtraId);
        assertThat(vinculoCriado).containsEntry("setorId", setorExtraId.intValue());

        var vinculosAtualizados = getManagerSetores(hospitalToken, managerId);
        assertThat(vinculosAtualizados)
                .extracting(vinculo -> ((Number) ((Map<?, ?>) vinculo).get("setorId")).longValue())
                .contains(setorInicialId, setorExtraId);

        desvincularManagerSetor(hospitalToken, managerId, setorExtraId);

        var vinculosDepoisDaRemocao = getManagerSetores(hospitalToken, managerId);
        assertThat(vinculosDepoisDaRemocao)
                .extracting(vinculo -> ((Number) ((Map<?, ?>) vinculo).get("setorId")).longValue())
                .contains(setorInicialId)
                .doesNotContain(setorExtraId);
    }

    @Test
    @Order(7)
    void escalistaVinculaEDesvinculaMedicoASetorPermitido() {
        var hospitalEmail = "hospital-link-doctor@example.com";
        var hospitalPassword = "senha123";

        createHospital(hospitalEmail, hospitalPassword);
        var hospitalToken = loginAndGetToken(hospitalEmail, hospitalPassword);

        var setorId = createSetor(hospitalToken, "Clinica Medica", "Setor de Clinica Medica");
        createManager(hospitalToken, setorId, "Laura Escalista", "09876543214",
                "laura.manager@example.com", "senha456", "Escalas");
        var escalistaToken = loginAndGetToken("laura.manager@example.com", "senha456");

        var doctorId = createDoctor("doctor-link-setor@example.com", "senha123", "Pedro Almeida",
                "12345678901", "1991-02-03", "Clinica Medica", "54321");

        var vinculoCriado = vincularDoctorSetor(escalistaToken, doctorId, setorId);
        assertThat(vinculoCriado).containsEntry("setorId", setorId.intValue());
        assertThat(vinculoCriado).containsEntry("medicoId", doctorId.intValue());

        var vinculosAtualizados = getDoctorSetores(escalistaToken, doctorId);
        assertThat(vinculosAtualizados)
                .extracting(vinculo -> ((Number) ((Map<?, ?>) vinculo).get("setorId")).longValue())
                .contains(setorId);

        desvincularDoctorSetor(escalistaToken, doctorId, setorId);

        var vinculosDepoisDaRemocao = getDoctorSetores(escalistaToken, doctorId);
        assertThat(vinculosDepoisDaRemocao)
                .extracting(vinculo -> ((Number) ((Map<?, ?>) vinculo).get("setorId")).longValue())
                .doesNotContain(setorId);
    }

    @Test
    @Order(8)
    void escalistaCriaPlantaoAvulsoApenasParaMedicoDoSetorSemConflito() {
        var hospitalEmail = "hospital-plantao-avulso@example.com";
        var hospitalPassword = "senha123";

        createHospital(hospitalEmail, hospitalPassword);
        var hospitalToken = loginAndGetToken(hospitalEmail, hospitalPassword);

        var setorId = createSetor(hospitalToken, "Pronto Atendimento", "Setor de Pronto Atendimento");
        createManager(hospitalToken, setorId, "Marcela Escalista", "09876543215",
                "marcela.manager@example.com", "senha456", "Escalas");
        var escalistaToken = loginAndGetToken("marcela.manager@example.com", "senha456");

        var doctorId = createDoctor("doctor-plantao-avulso@example.com", "senha123", "Renata Costa",
                "12345678902", "1992-03-04", "Pronto Atendimento", "67890");
        var doctorSemVinculoId = createDoctor("doctor-sem-vinculo@example.com", "senha123", "Rafael Lima",
                "12345678903", "1993-04-05", "Pronto Atendimento", "67891");

        vincularDoctorSetor(escalistaToken, doctorId, setorId);

        var plantaoCriado = createPlantaoAvulso(
                escalistaToken,
                setorId,
                doctorId,
                "2026-05-15T07:00:00",
                "2026-05-15T19:00:00");

        assertThat(plantaoCriado).containsEntry("status", "AGENDADO");
        assertThat(plantaoCriado).containsEntry("setorId", setorId.intValue());
        assertThat(plantaoCriado).containsEntry("doctorId", doctorId.intValue());

        createPlantaoAvulsoExpectBadRequest(
                escalistaToken,
                setorId,
                doctorId,
                "2026-05-15T13:00:00",
                "2026-05-15T20:00:00");

        createPlantaoAvulsoExpectBadRequest(
                escalistaToken,
                setorId,
                doctorSemVinculoId,
                "2026-05-16T07:00:00",
                "2026-05-16T19:00:00");
    }

    private Long createHospital(String email, String password) {
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
        return ((Number) response.getBody().get("id")).longValue();
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

    private Long createManager(String token, Long setorId, String name, String cpf, String email, String password, String department) {
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
        return ((Number) response.getBody().get("id")).longValue();
    }

    private List<?> getManagerSetores(String token, Long managerId) {
        var headers = new HttpHeaders();
        headers.setBearerAuth(token);

        ResponseEntity<List> response = restTemplate.exchange(
                "/manager/" + managerId + "/setores",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                List.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }

    private Map<String, Object> vincularManagerSetor(String token, Long managerId, Long setorId) {
        var headers = new HttpHeaders();
        headers.setBearerAuth(token);

        ResponseEntity<Map> response = restTemplate.exchange(
                "/manager/" + managerId + "/setores/" + setorId,
                HttpMethod.POST,
                new HttpEntity<>(headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }

    private void desvincularManagerSetor(String token, Long managerId, Long setorId) {
        var headers = new HttpHeaders();
        headers.setBearerAuth(token);

        ResponseEntity<Void> response = restTemplate.exchange(
                "/manager/" + managerId + "/setores/" + setorId,
                HttpMethod.DELETE,
                new HttpEntity<>(headers),
                Void.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    private List<?> getDoctorSetores(String token, Long doctorId) {
        var headers = new HttpHeaders();
        headers.setBearerAuth(token);

        ResponseEntity<List> response = restTemplate.exchange(
                "/doctor/" + doctorId + "/setores",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                List.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }

    private Map<String, Object> vincularDoctorSetor(String token, Long doctorId, Long setorId) {
        var headers = new HttpHeaders();
        headers.setBearerAuth(token);

        ResponseEntity<Map> response = restTemplate.exchange(
                "/doctor/" + doctorId + "/setores/" + setorId,
                HttpMethod.POST,
                new HttpEntity<>(headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }

    private void desvincularDoctorSetor(String token, Long doctorId, Long setorId) {
        var headers = new HttpHeaders();
        headers.setBearerAuth(token);

        ResponseEntity<Void> response = restTemplate.exchange(
                "/doctor/" + doctorId + "/setores/" + setorId,
                HttpMethod.DELETE,
                new HttpEntity<>(headers),
                Void.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }

    private Map<String, Object> createPlantaoAvulso(String token, Long setorId, Long doctorId,
            String dataInicio, String dataFim) {
        var headers = new HttpHeaders();
        headers.setBearerAuth(token);

        var request = Map.of(
                "setorId", setorId,
                "medicoId", doctorId,
                "dataInicio", dataInicio,
                "dataFim", dataFim
        );

        ResponseEntity<Map> response = restTemplate.exchange(
                "/plantao/avulso",
                HttpMethod.POST,
                new HttpEntity<>(request, headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        return response.getBody();
    }

    private void createPlantaoAvulsoExpectBadRequest(String token, Long setorId, Long doctorId,
            String dataInicio, String dataFim) {
        var headers = new HttpHeaders();
        headers.setBearerAuth(token);

        var request = Map.of(
                "setorId", setorId,
                "medicoId", doctorId,
                "dataInicio", dataInicio,
                "dataFim", dataFim
        );

        ResponseEntity<Map> response = restTemplate.exchange(
                "/plantao/avulso",
                HttpMethod.POST,
                new HttpEntity<>(request, headers),
                Map.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    private Long createDoctor(String email, String password, String name, String cpf, String birthday, String specialty, String crm) {
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
        return ((Number) response.getBody().get("id")).longValue();
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
