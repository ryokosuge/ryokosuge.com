FROM --platform=linux/arm64 mcr.microsoft.com/devcontainers/base:ubuntu-22.04

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

# ARM64アーキテクチャ用のGoをインストール
RUN curl -fsSL https://go.dev/dl/go${GO_VERSION}.linux-arm64.tar.gz -o /tmp/go${GO_VERSION}.linux-arm64.tar.gz \
    && tar -C /usr/local -xzf /tmp/go${GO_VERSION}.linux-arm64.tar.gz \
    && rm /tmp/go${GO_VERSION}.linux-arm64.tar.gz

ENV PATH="/usr/local/go/bin:${PATH}"
