FROM node:22-slim

# Install git (required for worktrees) and Claude Code
RUN apt-get update -qq && \
    apt-get install -y -qq git curl && \
    npm install -g @anthropic-ai/claude-code && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Git config for commits inside container
RUN git config --global user.email "doncheli@sandcastle" && \
    git config --global user.name "Don Cheli SDD"

WORKDIR /workspace
