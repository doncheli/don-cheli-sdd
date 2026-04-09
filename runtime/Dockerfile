FROM node:22-slim

# Install git + Claude Code + common tools
RUN apt-get update -qq && \
    apt-get install -y -qq git curl python3 && \
    npm install -g @anthropic-ai/claude-code tsx && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Git config for commits inside container
RUN git config --global user.email "runtime@doncheli.dev" && \
    git config --global user.name "Don Cheli Runtime"

WORKDIR /workspace
