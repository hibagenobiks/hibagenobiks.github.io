---
title: "Choosing the Right Reference Genome: Improving the Genetic Yield of Neurogenomic Disorders"
subtitle: "Every sequencing experiment begins with a reference genome. Whether it ends with a diagnosis may depend on choosing the right one."
description: "How ALT contigs in GRCh38 and the GBAP1 pseudogene can hide pathogenic GBA1 variants, and what to do about each problem."
kind: Technical note
date: 2026-07-02
last_modified_at: 2026-07-02
tags: [Neurogenomics, Clinical Genomics, Whole Genome Sequencing, Reference Genome, GBA1, Parkinson's Disease]
# Keep the old address so existing links and citations still work:
permalink: /neurogenomics/reference-genome-genetic-yield/
---

## Introduction

Over the past decade, next-generation sequencing (NGS) has transformed the diagnosis of neurological disorders. Whole-genome sequencing (WGS), whole-exome sequencing (WES), and targeted sequencing now allow clinicians and researchers to identify pathogenic variants responsible for disorders such as Parkinson's disease, Alzheimer's disease, amyotrophic lateral sclerosis (ALS), hereditary ataxias, epileptic encephalopathies, and numerous rare neurodevelopmental conditions. Yet, despite these remarkable advances, a significant proportion of patients still undergo comprehensive genetic testing without receiving a molecular diagnosis.

The likelihood of establishing a genetic diagnosis (commonly referred to as the **genetic yield**) is influenced by multiple factors:

- **Clinical phenotype.** Disorders with well-defined syndromic features generally achieve higher diagnostic rates than conditions with broad or overlapping presentations.
- **Inheritance.** Familial disorders, particularly those following clear Mendelian inheritance patterns, often achieve a higher diagnostic yield than sporadic cases, where disease may result from complex genetic architecture, reduced penetrance, de novo variants, or environmental influences.
- **Study design.** Trio sequencing, in which both parents are analysed alongside the affected individual, consistently improves diagnostic yield by enabling more accurate interpretation of inheritance patterns and de novo variants.
- **Sequencing approach.** Whole-genome sequencing offers advantages over whole-exome sequencing through improved detection of structural variants, copy number alterations, and variants residing outside protein-coding regions.
- **Repeat expansion analysis.** This has become an essential component of the diagnostic workflow for neurological disorders such as hereditary ataxias and motor neuron disease, where pathogenic repeat expansions account for a substantial proportion of cases missed by conventional short-variant pipelines.

Much of the discussion surrounding the remaining diagnostic gap has focused on biological challenges: variants of uncertain significance, incomplete knowledge of disease-associated genes, reduced interpretability of non-coding variation, and disease mechanisms that remain poorly understood. These are genuine limitations and continue to drive much of contemporary neurogenomics research.

However, an equally important contributor often receives far less attention, and it is entirely technical. Not every pathogenic variant is missed because biology is complex. Some are missed because the analysis pipeline never has the opportunity to detect them. Before a variant can be identified, sequencing reads must first be accurately aligned to a reference genome. If those reads cannot be confidently assigned to their correct genomic location, downstream variant callers may fail to recognise genuine pathogenic variants despite their presence in the sequencing data. Consequently, a seemingly simple technical decision, the choice of reference genome, can have a profound impact on diagnostic sensitivity.

**Key takeaway**
In some cases, the limiting factor is not the patient's genome, but the reference genome against which it is analysed.
{: .callout}

## Understanding the reference genome

Contrary to popular belief, the human reference genome is not the genome of a single individual. Rather, it is a composite assembly representing the best available reconstruction of human genomic sequence.

Modern reference assemblies contain far more than the 22 autosomes and sex chromosomes. They also include alternative representations of structurally diverse genomic regions, decoy sequences, unlocalized scaffolds, unplaced contigs, and specialised haplotypes designed to improve mapping accuracy in complex regions of the genome. Depending on the intended application, several versions of the human reference genome are commonly used.

{% include figure.html src="/images/reference-genome/fig1_reference_genome_architecture.svg" alt="Diagram of the human reference genome showing the primary assembly extended by ALT contigs, decoys and HLA haplotypes" caption="**Figure 1. Architecture of the human reference genome.** The Full Analysis Set extends the primary assembly by incorporating alternative contigs, decoy sequences, HLA haplotypes, and additional auxiliary sequences that improve representation of structurally complex regions." %}

<div class="compare">
  <div>
    <h4>Primary Assembly (no ALT)</h4>
    Only the canonical chromosomes; excludes alternative representations of highly polymorphic regions.
    <p>Advantages</p>
    <ul>
      <li>Simpler alignment</li>
      <li>Faster computational performance</li>
      <li>Broad compatibility with most bioinformatics pipelines</li>
      <li>Reduced computational complexity</li>
    </ul>
    <p>Limitations</p>
    <ul>
      <li>Limited representation of structurally diverse loci</li>
      <li>Reduced mapping accuracy in highly polymorphic regions</li>
      <li>May not adequately represent genomic diversity across populations</li>
    </ul>
  </div>
  <div>
    <h4>GRCh38 Full Analysis Set</h4>
    Extends the primary assembly with additional genomic representations:
    <ul>
      <li>Alternative (ALT) contigs</li>
      <li>Decoy sequences</li>
      <li>HLA haplotypes</li>
      <li>Additional complex genomic representations</li>
    </ul>
    <p>Trade-off</p>
    A more comprehensive representation of human diversity, recommended by several large-scale sequencing initiatives. However, unless the aligner and variant caller are designed to recognise these sequences, they may inadvertently <em>reduce</em> variant detection in certain regions.
  </div>
</div>

{% include figure.html src="/images/reference-genome/fig2_primary_vs_full_analysis_set.png" alt="Side-by-side comparison of the Primary Assembly and the GRCh38 Full Analysis Set" caption="**Figure 2. Primary Assembly versus Full Analysis Set.** While the Full Analysis Set better represents genomic diversity, it also introduces additional alignment complexity that requires ALT-aware analytical workflows." %}

## What are ALT contigs?

Alternative contigs (ALT contigs) represent legitimate alternative versions of genomic regions that exhibit substantial structural variation within the human population.

Rather than forcing sequencing reads from every individual onto a single chromosome sequence, ALT contigs provide additional representations of highly variable genomic loci. These alternative sequences better capture naturally occurring human diversity while preserving the primary chromosomal assembly. ALT contigs are particularly common within genomic regions containing:

- Large insertions or deletions
- Structural rearrangements
- Highly polymorphic haplotypes
- Complex immune loci (such as the HLA region)
- Segmental duplications and duplicated genes

From a population genomics perspective, ALT contigs provide a more faithful representation of human genetic diversity. However, they also introduce an important analytical challenge that directly influences variant detection, particularly when the downstream alignment and variant-calling pipeline is not ALT-aware.

## When a full reference genome can reduce diagnostic sensitivity

One of the most counterintuitive observations in clinical genomics is that a more complete reference genome can occasionally *decrease* variant detection sensitivity.

In genomic regions represented by both the primary chromosome and one or more ALT contigs, sequencing reads may align equally well to multiple genomic locations. Because the aligner cannot confidently determine the true origin of these reads, it assigns them a low mapping quality (MAPQ), often **MAPQ = 0**, indicating ambiguous alignment.

Most variant callers subsequently ignore or substantially down-weight these reads during variant calling. Consequently, pathogenic variants supported exclusively by ambiguously mapped reads may never be evaluated, despite being present within the sequencing data. For genes located within structurally complex loci, this phenomenon may substantially reduce the diagnostic yield if ALT-aware processing is not incorporated into the analytical workflow.

Reference genome selection should therefore always be considered together with alignment strategy and variant-calling methodology.

{% include figure.html src="/images/reference-genome/fig3_alt_contigs_reduce_yield.png" alt="Reads aligning equally to a primary chromosome region and an ALT contig receive MAPQ 0" caption="**Figure 3. ALT contigs can reduce diagnostic yield.** Reads originating from regions represented by both the primary chromosome and an ALT contig align equally well to multiple locations, resulting in low mapping quality (MAPQ = 0). These reads are subsequently ignored during variant calling, reducing diagnostic sensitivity." %}

## GBA1: a case study

Among genes implicated in neurodegenerative disease, *GBA1* provides one of the clearest examples of why reference genome selection matters.

Pathogenic variants in *GBA1* are responsible for Gaucher disease, while heterozygous pathogenic variants represent one of the strongest known genetic risk factors for Parkinson's disease. Despite its clinical importance, however, *GBA1* remains one of the most technically challenging genes to analyse using short-read sequencing technologies.

The complexity of the locus arises from **two distinct problems**, each affecting variant detection through a different mechanism. The first is introduced by the reference genome itself, whereas the second reflects the intrinsic genomic architecture of the locus. Although often discussed together, these challenges are fundamentally different and require different analytical solutions.

### Challenge 1: ALT contigs and ambiguous read mapping

The GRCh38 Full Analysis Set includes an alternative representation of part of the *GBA1* locus. Within this region, a stretch of the primary chromosome shares 100% sequence identity with the corresponding ALT contig.

When sequencing reads originate from this region, the aligner cannot determine whether they belong to the primary chromosome or the alternative contig. Rather than assigning them uniquely, the reads become multi-mapped and receive a mapping quality of zero, indicating that their genomic origin cannot be resolved confidently.

Although this appears to be a small technical detail, its downstream consequences are substantial. Variant callers such as GATK HaplotypeCaller rely heavily on mapping quality during local assembly. Reads with MAPQ = 0 are excluded or assigned negligible weight during variant calling. As a result, pathogenic variants present within these reads may never be evaluated, not because the sequencing failed, but because the computational pipeline considered the supporting reads unreliable.

<div class="callout warn" markdown="1">
**The consequence is striking**

1. The pathogenic variant is present in the raw sequencing data.
2. The supporting reads are present in the BAM file.
3. The patient genuinely carries the mutation.
4. Yet no variant appears in the final VCF.
</div>

From the perspective of clinical genetics, this represents a false-negative result, reducing the overall diagnostic yield despite adequate sequencing coverage. Ironically, a reference genome designed to better represent human genetic diversity can reduce variant detection if ALT-aware alignment and downstream processing are not incorporated into the analytical workflow.

{% include figure.html src="/images/reference-genome/fig4_gba1_alt_contig_example.png" alt="Part of the GBA1 locus is identical to an ALT contig, so reads map to both with MAPQ 0" caption="**Figure 4. Reference genome-induced mapping ambiguity at the *GBA1* locus.** A region of the *GBA1* locus shares identical sequence with an ALT contig in the GRCh38 Full Analysis Set. Reads originating from this region align equally well to both genomic locations, resulting in MAPQ = 0 and preventing reliable variant detection." %}

### Challenge 2: the GBAP1 pseudogene

Independent of the ALT-contig issue, *GBA1* presents a second challenge due to its genomic architecture.

Located approximately 16 kb downstream lies *GBAP1*, a highly homologous pseudogene sharing nearly 96% sequence identity with *GBA1* across its coding region. Sequence similarity increases to ~98% from intron 8 through exon 11 and into the 3′ untranslated region (3′ UTR), with the highest homology spanning exons 8–11. Within this region, short sequencing reads frequently cannot distinguish between the functional gene and its pseudogene, resulting in ambiguous read alignment, reduced mapping confidence, and inaccurate variant assignment.

As a consequence, reads originating from *GBA1* may align to *GBAP1*, while pseudogene-derived reads may align to *GBA1*. The situation is further complicated by recurrent gene-conversion and recombinant events between the two loci, producing hybrid alleles that are particularly difficult to resolve using conventional short-read sequencing.

Unlike the ALT-contig problem, this ambiguity is not introduced by the reference genome. It is an intrinsic property of the human genome itself. Nevertheless, the outcome is similar: reduced confidence in alignment, inaccurate variant assignment, and the possibility of clinically significant variants being overlooked or misclassified.

{% include figure.html src="/images/reference-genome/fig5_gba1_gbap1_pseudogene.png" alt="Map of GBA1 and the downstream GBAP1 pseudogene with high-homology exons 8 to 11 highlighted" caption="**Figure 5. The *GBA1*–*GBAP1* locus.** Extensive sequence similarity, particularly across exons 8–11, creates alignment ambiguity for short sequencing reads, complicating accurate variant detection." %}

## Addressing the two challenges

Although both challenges ultimately reduce diagnostic sensitivity, they arise from fundamentally different mechanisms and therefore require distinct analytical strategies.

### ALT-contig mapping ambiguity

For the ALT-contig mapping issue, careful selection of the reference genome is essential. In analyses where ALT-aware processing is unavailable or not optimally configured, aligning sequencing reads against the Primary Assembly may reduce unnecessary multi-mapping in affected regions. Conversely, when using the GRCh38 Full Analysis Set, the alignment and variant-calling pipeline should be specifically designed to recognise and appropriately process ALT contigs.

The choice of reference genome should therefore never be considered independently of the downstream computational workflow.

### The GBAP1 pseudogene

The *GBAP1* pseudogene, however, cannot be resolved simply by changing the reference genome. Instead, orthogonal approaches are required:

- **Long reads.** Targeted amplicon sequencing combined with Oxford Nanopore Technologies (ONT) long-read sequencing allows individual DNA molecules to span unique regions flanking the homologous sequence, enabling unambiguous assignment of reads to either *GBA1* or *GBAP1*. Unlike short reads, long reads provide sufficient genomic context to distinguish the functional gene from its pseudogene and to identify recombinant alleles.
- **Specialised callers.** Computational tools such as Gauchian have been developed specifically to resolve variants within this complex locus using short-read sequencing. Gauchian distinguishes true *GBA1* variants from pseudogene-derived artefacts while simultaneously identifying recombinant alleles that are frequently missed by conventional variant-calling pipelines.

Together, these approaches substantially improve analytical sensitivity and reduce the likelihood that clinically significant *GBA1* variants will be overlooked.

{% include figure.html src="/images/reference-genome/fig6_solving_two_problems.svg" alt="Summary diagram: ALT ambiguity is fixed by reference choice or ALT-aware alignment; GBAP1 homology needs long reads or Gauchian" caption="**Figure 6. Two challenges, two solutions.** ALT-contig ambiguity can be addressed through appropriate reference genome selection or ALT-aware alignment, whereas *GBAP1* homology often requires long-read sequencing or specialised computational methods such as Gauchian." %}

## Conclusion

The conversation surrounding genetic diagnosis often focuses on sequencing depth, variant callers, or variant interpretation. Yet long before any of these steps, a more fundamental decision has already been made: which reference genome should the sequencing reads be aligned to?

That single decision influences every downstream stage of analysis. It determines where sequencing reads map, how confidently they are aligned, which variants are ultimately called, and whether a patient receives a molecular diagnosis.

As sequencing moves deeper into complex regions of the genome (regions enriched for structural variation, segmental duplications, alternative haplotypes, and pseudogenes), the reference genome can no longer be viewed as a passive coordinate system. It is an active component of the diagnostic pipeline.

The *GBA1* locus exemplifies this principle. Here, one analytical challenge arises from the inclusion of ALT contigs within the reference assembly, while another stems from the presence of a highly homologous pseudogene. Although distinct in origin, both can lead to missed pathogenic variants if not appropriately recognised and addressed.

Improving the genetic yield of neurogenomic disorders will require more than increasingly powerful sequencing technologies. It will require thoughtful integration of sequencing platforms, alignment strategies, specialised computational tools, and, perhaps most importantly, the recognition that choosing the right reference genome is itself a critical diagnostic decision.

## Further reading

- [Genome Reference Consortium: GRCh38](https://www.ncbi.nlm.nih.gov/grc/human)
- [GATK Best Practices for Variant Discovery](https://gatk.broadinstitute.org/hc/en-us/sections/360007226651-Best-Practices-Workflows)
- [Human Pangenome Reference Consortium](https://humanpangenome.org/)
- [Gauchian on GitHub (Illumina)](https://github.com/Illumina/Gauchian): accurate analysis of the *GBA1* locus from short-read sequencing
- *GBA1* and Parkinson's disease <!-- add a link to your preferred review -->
- Oxford Nanopore Technologies in clinical genomics <!-- add a link -->
