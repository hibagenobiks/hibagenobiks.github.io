---
title: "Choosing the Right Reference Genome: Improving the Genetic Yield of Neurogenomic Disorders"
*Technical Note*

**Author:** Hiba Ali

**Published:** July 2, 2026

**Last Updated:** July 2, 2026

**Reading Time:** ~12 min

**Keywords:** Neurogenomics • Clinical Genomics • Whole Genome Sequencing • Reference Genome • GRCh38 • ALT Contigs • GBA1 • Parkinson's Disease

-----
date: 2026-07-02
permalink: /neurogenomics/reference-genome-genetic-yield/
tags:
  - Neurogenomics
  - Clinical Genomics
  - Bioinformatics
  - Parkinson's Disease
  - GBA1
  - Whole Genome Sequencing
  - Reference Genome
author_profile: true
toc: true
toc_sticky: true
read_time: true
comments: false
share: true
---

# Choosing the Right Reference Genome: Improving the Genetic Yield of Neurogenomic Disorders

> *Every sequencing experiment begins with a reference genome. Whether it ends with a diagnosis may depend on choosing the right one.*

---

# Introduction

Over the past decade, next-generation sequencing (NGS) has transformed the diagnosis of neurological disorders. Whole-genome sequencing (WGS), whole-exome sequencing (WES), and targeted sequencing now allow clinicians and researchers to identify pathogenic variants responsible for disorders such as Parkinson's disease, Alzheimer's disease, amyotrophic lateral sclerosis (ALS), hereditary ataxias, epileptic encephalopathies, and numerous rare neurodevelopmental conditions. Yet, despite these remarkable advances, a significant proportion of patients still undergo comprehensive genetic testing without receiving a molecular diagnosis.

The likelihood of establishing a genetic diagnosis (commonly referred to as the **genetic yield**) is influenced by multiple factors. Clinical phenotype plays a crucial role; disorders with well-defined syndromic features generally achieve higher diagnostic rates than conditions with broad or overlapping presentations. Likewise, **familial disorders**, particularly those following clear Mendelian inheritance patterns, often achieve a higher diagnostic yield than **sporadic cases**, where disease may result from complex genetic architecture, reduced penetrance, *de novo* variants, or environmental influences. Study design also matters. Trio sequencing, in which both parents are analysed alongside the affected individual, consistently improves diagnostic yield by enabling more accurate interpretation of inheritance patterns and *de novo* variants. Likewise, whole-genome sequencing offers advantages over whole-exome sequencing through improved detection of structural variants, copy number alterations, and variants residing outside protein-coding regions. More recently, dedicated repeat expansion analysis has become an essential component of the diagnostic workflow for neurological disorders such as hereditary ataxias and motor neuron disease, where pathogenic repeat expansions account for a substantial proportion of cases missed by conventional short-variant pipelines.

Much of the discussion surrounding the remaining diagnostic gap has focused on biological challenges: variants of uncertain significance, incomplete knowledge of disease-associated genes, reduced interpretability of non-coding variation, and disease mechanisms that remain poorly understood. These are genuine limitations and continue to drive much of contemporary neurogenomics research.

However, an equally important contributor often receives far less attention—and it is entirely technical. Not every pathogenic variant is missed because biology is complex. Some are missed because the analysis pipeline never has the opportunity to detect them. Before a variant can be identified, sequencing reads must first be accurately aligned to a reference genome. If those reads cannot be confidently assigned to their correct genomic location, downstream variant callers may fail to recognise genuine pathogenic variants despite their presence in the sequencing data. Consequently, a seemingly simple technical decision—the **choice of reference genome**—can have a profound impact on diagnostic sensitivity.

> **Key Takeaway**
>
> In some cases, the limiting factor is not the patient's genome, but the reference genome against which it is analysed.

---

# Understanding the Reference Genome

Contrary to popular belief, the human reference genome is not the genome of a single individual. Rather, it is a composite assembly representing the best available reconstruction of human genomic sequence.

Modern reference assemblies contain far more than the 22 autosomes and sex chromosomes. They also include alternative representations of structurally diverse genomic regions, decoy sequences, unlocalized scaffolds, unplaced contigs, and specialised haplotypes designed to improve mapping accuracy in complex regions of the genome.

Depending on the intended application, several versions of the human reference genome are commonly used.

---

![Figure 1: Architecture of the Human Reference Genome](/images/reference-genome/fig1_reference_genome_architecture.svg)

*Figure 1. Architecture of the human reference genome. The Full Analysis Set extends the primary assembly by incorporating alternative contigs, decoy sequences, HLA haplotypes, and additional auxiliary sequences that improve representation of structurally complex regions.*

---

## Primary Assembly (No ALT)

The **Primary Assembly** contains only the canonical chromosomes and excludes alternative representations of highly polymorphic genomic regions.

### Advantages

- Simpler alignment
- Faster computational performance
- Broad compatibility with most bioinformatics pipelines
- Reduced computational complexity

### Limitations

- Limited representation of structurally diverse loci
- Reduced mapping accuracy in highly polymorphic regions
- May not adequately represent genomic diversity across populations

---

## Full Analysis Set

The **GRCh38 Full Analysis Set** extends the primary assembly by incorporating additional genomic representations, including:

- Alternative (ALT) contigs
- Decoy sequences
- HLA haplotypes
- Additional complex genomic representations

These additional sequences provide a more comprehensive representation of human genomic diversity and are recommended by several large-scale sequencing initiatives.

However, increased completeness also introduces additional analytical complexity. Unless alignment algorithms and downstream variant-calling pipelines are specifically designed to recognise these additional genomic representations, they may inadvertently reduce variant detection in certain genomic regions.

---

![Figure 2: Primary Assembly versus Full Analysis Set](/images/reference-genome/fig2_primary_vs_full_analysis_set.png)

*Figure 2. Comparison between the Primary Assembly and the GRCh38 Full Analysis Set. While the Full Analysis Set better represents genomic diversity, it also introduces additional alignment complexity that requires ALT-aware analytical workflows.*

---

# What Are ALT Contigs?

Alternative contigs (**ALT contigs**) represent legitimate alternative versions of genomic regions that exhibit substantial structural variation within the human population.

Rather than forcing sequencing reads from every individual onto a single chromosome sequence, ALT contigs provide additional representations of highly variable genomic loci. These alternative sequences better capture naturally occurring human diversity while preserving the primary chromosomal assembly.

ALT contigs are particularly common within genomic regions containing:

- Large insertions or deletions
- Structural rearrangements
- Highly polymorphic haplotypes
- Complex immune loci (such as the HLA region)
- Segmental duplications and duplicated genes

From a population genomics perspective, ALT contigs provide a more faithful representation of human genetic diversity. However, they also introduce an important analytical challenge that directly influences variant detection, particularly when the downstream alignment and variant-calling pipeline is not ALT-aware.

# When a Full Reference Genome Can Reduce Diagnostic Sensitivity

One of the most counterintuitive observations in clinical genomics is that a more complete reference genome can occasionally decrease variant detection sensitivity.

In genomic regions represented by both the primary chromosome and one or more ALT contigs, sequencing reads may align equally well to multiple genomic locations. Because the aligner cannot confidently determine the true origin of these reads, it assigns them a **low mapping quality (MAPQ)**, often **MAPQ = 0**, indicating ambiguous alignment.

Most variant callers subsequently ignore or substantially down-weight these reads during variant calling. Consequently, pathogenic variants supported exclusively by ambiguously mapped reads may never be evaluated, despite being present within the sequencing data.

For genes located within structurally complex loci, this phenomenon may substantially reduce the diagnostic yield if ALT-aware processing is not incorporated into the analytical workflow.

Consequently, reference genome selection should always be considered together with alignment strategy and variant-calling methodology.

---

![Figure 3: ALT contigs reduce diagnostic yield](/images/reference-genome/fig3_alt_contigs_reduce_yield.png)

*Figure 3. Reads originating from regions represented by both the primary chromosome and an ALT contig align equally well to multiple locations, resulting in low mapping quality (MAPQ = 0). These reads are subsequently ignored during variant calling, reducing diagnostic sensitivity.*

---

# GBA1: A Case Study in How Reference Genome Choice Influences Genetic Diagnosis

Among genes implicated in neurodegenerative disease, **GBA1** provides one of the clearest examples of why reference genome selection matters.

Pathogenic variants in **GBA1** are responsible for **Gaucher disease**, while heterozygous pathogenic variants represent one of the strongest known genetic risk factors for **Parkinson's disease**. Despite its clinical importance, however, **GBA1** remains one of the most technically challenging genes to analyse using short-read sequencing technologies.

The complexity of the locus arises from **two distinct problems**, each affecting variant detection through a different mechanism. The first is introduced by the **reference genome itself**, whereas the second reflects the intrinsic genomic architecture of the locus. Although often discussed together, these challenges are fundamentally different and require different analytical solutions.

---

## Challenge 1 — Alternative Contigs and Ambiguous Read Mapping

The **GRCh38 Full Analysis Set** includes an alternative representation of part of the **GBA1** locus. Within this region, a stretch of the primary chromosome shares **100% sequence identity** with the corresponding ALT contig.

When sequencing reads originate from this region, the aligner cannot determine whether they belong to the primary chromosome or the alternative contig. Rather than assigning them uniquely, the reads become **multi-mapped** and receive a **mapping quality (MAPQ) of zero**, indicating that their genomic origin cannot be resolved confidently.

Although this appears to be a small technical detail, its downstream consequences are substantial.

Variant callers such as **GATK HaplotypeCaller** rely heavily on mapping quality during local assembly. Reads with **MAPQ = 0** are excluded or assigned negligible weight during variant calling. As a result, pathogenic variants present within these reads may never be evaluated—not because the sequencing failed, but because the computational pipeline considered the supporting reads unreliable.

The consequence is striking.

- The pathogenic variant is present in the raw sequencing data.
- The supporting reads are present in the BAM file.
- The patient genuinely carries the mutation.
- Yet no variant appears in the final VCF.

From the perspective of clinical genetics, this represents a **false-negative result**, reducing the overall diagnostic yield despite adequate sequencing coverage.

Ironically, a reference genome designed to better represent human genetic diversity can reduce variant detection if ALT-aware alignment and downstream processing are not incorporated into the analytical workflow.

---

![Figure 4: Reference genome-induced mapping ambiguity at the GBA1 locus](/images/reference-genome/fig4_gba1_alt_contig_example.png)

*Figure 4. A region of the GBA1 locus shares identical sequence with an ALT contig in the GRCh38 Full Analysis Set. Reads originating from this region align equally well to both genomic locations, resulting in MAPQ = 0 and preventing reliable variant detection.*

## Challenge 2 — The GBAP1 Pseudogene

Independent of the ALT-contig issue, **GBA1** presents a second challenge due to its genomic architecture.

Located approximately **16 kb downstream** lies **GBAP1**, a highly homologous pseudogene sharing nearly **96% sequence identity** with **GBA1** across its coding region. Sequence similarity increases to **~98% from intron 8 through exon 11 and into the 3′ untranslated region (3′ UTR)**, with the highest homology spanning **exons 8–11**. Within this region, short sequencing reads frequently cannot distinguish between the functional gene and its pseudogene, resulting in ambiguous read alignment, reduced mapping confidence, and inaccurate variant assignment.

As a consequence, reads originating from **GBA1** may align to **GBAP1**, while pseudogene-derived reads may align to **GBA1**. The situation is further complicated by recurrent gene-conversion and recombinant events between the two loci, producing hybrid alleles that are particularly difficult to resolve using conventional short-read sequencing.

Unlike the ALT-contig problem, this ambiguity is **not introduced by the reference genome**. It is an intrinsic property of the human genome itself. Nevertheless, the outcome is similar: reduced confidence in alignment, inaccurate variant assignment, and the possibility of clinically significant variants being overlooked or misclassified.

---

![Figure 5: The GBA1–GBAP1 locus](/images/reference-genome/fig5_gba1_gbap1_pseudogene.png)

*Figure 5. The GBA1 locus and its highly homologous pseudogene GBAP1. Extensive sequence similarity—particularly across exons 8–11—creates alignment ambiguity for short sequencing reads, complicating accurate variant detection.*

---

# Addressing the Two Challenges

Although both challenges ultimately reduce diagnostic sensitivity, they arise from fundamentally different mechanisms and therefore require distinct analytical strategies.

### Addressing ALT-Contig Mapping Ambiguity

For the ALT-contig mapping issue, careful selection of the reference genome is essential. In analyses where ALT-aware processing is unavailable or not optimally configured, aligning sequencing reads against the **Primary Assembly** may reduce unnecessary multi-mapping in affected regions. Conversely, when using the **GRCh38 Full Analysis Set**, the alignment and variant-calling pipeline should be specifically designed to recognise and appropriately process ALT contigs.

The choice of reference genome should therefore never be considered independently of the downstream computational workflow.

### Addressing the GBAP1 Pseudogene

The **GBAP1** pseudogene, however, cannot be resolved simply by changing the reference genome.

Instead, orthogonal approaches are required. Targeted **amplicon sequencing** combined with **Oxford Nanopore Technologies (ONT)** long-read sequencing allows individual DNA molecules to span unique regions flanking the homologous sequence, enabling unambiguous assignment of reads to either **GBA1** or **GBAP1**. Unlike short reads, long reads provide sufficient genomic context to distinguish the functional gene from its pseudogene and to identify recombinant alleles.

In parallel, specialised computational tools such as **Gauchian** have been developed specifically to resolve variants within this complex locus using short-read sequencing. Gauchian distinguishes true **GBA1** variants from pseudogene-derived artefacts while simultaneously identifying recombinant alleles that are frequently missed by conventional variant-calling pipelines.

Together, these approaches substantially improve analytical sensitivity and reduce the likelihood that clinically significant **GBA1** variants will be overlooked.

---

![Figure 6: Addressing two distinct challenges](/images/reference-genome/fig6_solving_two_problems.svg)

*Figure 6. The two challenges affecting GBA1 require different solutions. ALT-contig ambiguity can be addressed through appropriate reference genome selection or ALT-aware alignment, whereas GBAP1 homology often requires long-read sequencing or specialised computational methods such as Gauchian.*

---

# Conclusion

The conversation surrounding genetic diagnosis often focuses on sequencing depth, variant callers, or variant interpretation. Yet long before any of these steps, a more fundamental decision has already been made: **which reference genome should the sequencing reads be aligned to?**

That single decision influences every downstream stage of analysis. It determines where sequencing reads map, how confidently they are aligned, which variants are ultimately called, and whether a patient receives a molecular diagnosis.

As sequencing moves deeper into complex regions of the genome—regions enriched for structural variation, segmental duplications, alternative haplotypes, and pseudogenes—the reference genome can no longer be viewed as a passive coordinate system. It is an active component of the diagnostic pipeline.

The **GBA1** locus exemplifies this principle. Here, one analytical challenge arises from the inclusion of ALT contigs within the reference assembly, while another stems from the presence of a highly homologous pseudogene. Although distinct in origin, both can lead to missed pathogenic variants if not appropriately recognised and addressed.

Improving the genetic yield of neurogenomic disorders will require more than increasingly powerful sequencing technologies. It will require thoughtful integration of sequencing platforms, alignment strategies, specialised computational tools, and—perhaps most importantly—the recognition that **choosing the right reference genome is itself a critical diagnostic decision**.

---

## Further Reading

- Genome Reference Consortium (GRCh38)
- GATK Best Practices for Variant Discovery
- Human Pangenome Reference Consortium
- GBA1 and Parkinson's Disease
- Oxford Nanopore Technologies in Clinical Genomics
- Gauchian: Accurate Analysis of the GBA1 Locus from Short-Read Sequencing

## Citation

If you found this article useful, please cite it as:

Ali H. (2026).

*Choosing the Right Reference Genome: Improving the Genetic Yield of Neurogenomic Disorders.*

Neurogenomics Notes.

https://hibagenobiks.github.io/neurogenomics/reference-genome-genetic-yield/

