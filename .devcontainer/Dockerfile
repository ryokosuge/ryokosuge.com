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

# Hugoバージョンをビルド引数で指定可能に
ARG HUGO_VERSION=0.147.5

# Hugoのインストール（extended_withdeploy版）
RUN curl -fsSL https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-arm64.tar.gz -o /tmp/hugo.tar.gz \
    && tar -C /tmp -xzf /tmp/hugo.tar.gz \
    && mv /tmp/hugo /usr/local/bin/ \
    && rm /tmp/hugo.tar.gz

ENV PATH="/usr/local/bin:${PATH}"

# GitHub CLIバージョンをビルド引数で指定可能に
ARG GH_CLI_VERSION=2.73.0

# GitHub CLIのインストール（arm64バイナリ）
RUN curl -fsSL https://github.com/cli/cli/releases/download/v${GH_CLI_VERSION}/gh_${GH_CLI_VERSION}_linux_arm64.tar.gz -o /tmp/gh.tar.gz \
    && tar -C /tmp -xzf /tmp/gh.tar.gz \
    && mv /tmp/gh_${GH_CLI_VERSION}_linux_arm64/bin/gh /usr/local/bin/ \
    && rm -rf /tmp/gh.tar.gz /tmp/gh_${GH_CLI_VERSION}_linux_arm64
