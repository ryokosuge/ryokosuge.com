FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    curl \
    git \
    ca-certificates \
    build-essential \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Goバージョンをビルド引数で指定可能に
ARG GO_VERSION=1.24.3

RUN curl -fsSL https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz -o /tmp/go${GO_VERSION}.linux-amd64.tar.gz \
    && tar -C /usr/local -xzf /tmp/go${GO_VERSION}.linux-amd64.tar.gz \
    && rm /tmp/go${GO_VERSION}.linux-amd64.tar.gz

ENV PATH="/usr/local/go/bin:${PATH}"

# ワークディレクトリ
WORKDIR /workspace

# markdownfmt (Go製Markdownフォーマッター) のインストール
RUN go install github.com/shurcooL/markdownfmt@latest && \
    ln -s /root/go/bin/markdownfmt /usr/local/bin/markdownfmt || true