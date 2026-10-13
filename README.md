<div align="center">

<img src="assets/capybara.svg" alt="Socio-Foundation capybara" width="112" />

# Socio-Foundation

**Every person is different. Simulation should be too.**

A Model for Generalizable Individual Behavior Simulation<br />
via Hierarchical Capability Distillation

[**🌐 Project Homepage**](https://sii-research.github.io/socio-foundation/) · [**📄 Paper**](https://arxiv.org/abs/2610.08967) · [**🤗 Model**](https://huggingface.co/SII-LancelotXie/Socio-Foundation-8B) · [**💻 Research Code**](https://github.com/Lancelot-Xie/Socio-Foundation)

Fudan University · Shanghai Innovation Institute · Tencent

</div>

---

## About

**Socio-Foundation** is an 8B model for individual behavior simulation, built on Qwen3-8B. Through hierarchical capability distillation—from task experts to capability experts to a unified model—it aims to preserve individual differences across diverse social contexts.

**Socio-Foundation** 是基于 Qwen3-8B 的个体行为模拟模型，通过“任务专家 → 能力专家 → 统一模型”的分层能力蒸馏，让模拟在不同社会情境中保留个体的偏好、行为特征与连续性。

## Explore the project

- **[Application demos](https://sii-research.github.io/socio-foundation/applications/)** — Tutoring, customer support, and negotiation, with example conversations and short videos.
- **[IndiEval leaderboard](https://sii-research.github.io/socio-foundation/leaderboard.html)** — Model comparisons across five capability dimensions and 29 metrics.
- **[Method & results](https://sii-research.github.io/socio-foundation/#framework)** — The training framework and evaluation findings, with English and Chinese views.

## Open resources

| Resource | Description |
| --- | --- |
| [Socio-Foundation-8B](https://huggingface.co/SII-LancelotXie/Socio-Foundation-8B) | Model weights |
| [SocioBank](https://huggingface.co/datasets/SII-LancelotXie/SocioBank) | Individual behavior simulation data |
| [IndiEval](https://huggingface.co/datasets/SII-LancelotXie/IndiEval) | Evaluation dataset |
| [Research code](https://github.com/Lancelot-Xie/Socio-Foundation) | Training and evaluation implementation |

## This repository

This repository hosts the static project website, published with **GitHub Pages**. The application demos show pre-generated examples; browsing the site does not call a model API.

To preview locally:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open <http://127.0.0.1:8080/>. No build step or dependencies are required. Updates to the `main` branch are automatically published to the project homepage.
