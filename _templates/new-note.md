---
# HOW TO USE: copy this file into _posts/ and rename it
#   YYYY-MM-DD-short-title-with-dashes.md   (e.g. 2026-11-15-what-is-a-polygenic-risk-score.md)
# The date in the file name is the publish date. Files dated in the future are hidden.
title: "Your title here"
subtitle: "Optional one-line hook shown under the title."
description: "One sentence shown on the note card and in Google/social previews."
kind: Explainer            # e.g. Technical note, Explainer, Paper summary, Essay
date: 2026-11-15
tags: [Neuroscience, Parkinson's Disease]
toc: true                  # side "On this page" menu; set false for short notes
math: false                # set true to use LaTeX: $E = mc^2$
---

Opening paragraph. Say in two or three sentences what the reader will learn and why it matters.

## First section

Normal paragraphs. *Italics* for gene names like *SNCA*, **bold** for key terms.

**Key takeaway**
A highlighted box. Write the heading in bold on the first line, then the text, then the line below.
{: .callout}

**Watch out**
Same thing, in amber, for pitfalls.
{: .callout .warn}

{% include figure.html src="/images/your-folder/figure1.png" alt="What the figure shows, for screen readers" caption="**Figure 1. Title.** Caption text." %}

### A subsection

| Column A | Column B |
|---|---|
| Tables | work like this |

```bash
bwa-mem2 mem -t 8 ref.fa R1.fq.gz R2.fq.gz > out.sam
```

> A quotation, if you need one.

## Further reading

- [Link text](https://example.org)
