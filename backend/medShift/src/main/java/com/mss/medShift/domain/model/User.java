package com.mss.medShift.domain.model;

import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public class User {

    private String name;
    private String cpf;
    private String birthday;
    private String password;

    public User() {

    }

    public User(String name, String cpf, String birthday, String password) {
        this.name = name;
        this.cpf = cpf;
        this.birthday = birthday;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
