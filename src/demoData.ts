import { UploadedPaper, PaperSummary, ComparisonResult } from "./types.ts";

export const DEMO_SUMMARIES: Record<string, PaperSummary> = {
  "attention_all_you_need": {
    title: "Attention Is All You Need",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin",
    publicationYear: "2017",
    abstractSummary: "This seminal paper introduces the Transformer, a novel network architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. It achieves superior translation quality while being more parallelizable and requiring significantly less training time.",
    keyFindings: [
      "The Transformer architecture outperforms previous RNN/LSTM models on translation tasks.",
      "Self-attention allows the model to capture dependencies regardless of their distance in the input or output sequences.",
      "Achieved 28.4 BLEU on WMT 2014 English-to-German translation, establishing a new state-of-the-art."
    ],
    methodology: "Replaced recurrent neural network (RNN) layers with Multi-Head Self-Attention layers and feed-forward networks. Utilized positional encodings to preserve word order. Trained on 8 NVIDIA P100 GPUs using the WMT 2014 English-to-German and English-to-French datasets.",
    conclusions: "The Transformer is the first sequence transduction model relying entirely on self-attention, proving that attention alone is sufficient for sequence modeling. It has since become the foundation for modern LLMs.",
    limitations: "Requires huge amounts of training data and suffers from quadratic memory complexity O(n²) with respect to the sequence length n."
  },
  "bert_transformer": {
    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: "Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova (Google AI Language)",
    publicationYear: "2018",
    abstractSummary: "Introduces BERT, a new language representation model designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context. BERT can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of NLP tasks.",
    keyFindings: [
      "Bidirectional pre-training is crucial for capturing accurate context compared to left-to-right unidirectional training.",
      "Achieved state-of-the-art results on 11 NLP tasks, including GLUE, SQuAD v1.1, and SQuAD v2.0.",
      "Proved that pre-trained representations eliminate the need for many heavily-engineered task-specific architectures."
    ],
    methodology: "Pre-trained on two tasks: Masked Language Model (MLM, predicting random masked tokens) and Next Sentence Prediction (NSP). Uses the Transformer encoder architecture as the backbone. Fine-tuned on task-specific labeled datasets with minor head adjustments.",
    conclusions: "Rich, bidirectional pre-training is highly effective for language understanding tasks. BERT establishes a strong foundation, demonstrating that unsupervised pre-training is generalizable.",
    limitations: "MLM pre-training introduces a mismatch between pre-training and fine-tuning since the [MASK] token never appears during fine-tuning."
  }
};

export const DEMO_COMPARISON: ComparisonResult = {
  similarities: "Both papers rely on the Transformer architecture (Vaswani et al., 2017) as their underlying mechanism for capturing representation. They utilize self-attention layers to model relationships between tokens in a sequence without recurrent connections, enabling massive parallelization during training. Additionally, both projects were developed by researchers at Google.",
  differences: "Attention Is All You Need focuses on sequence-to-sequence machine translation using a full encoder-decoder Transformer architecture. In contrast, BERT is designed specifically for unsupervised language representation (pre-training) using only the Transformer encoder blocks. Furthermore, BERT introduces bidirectional contextual training through masking (MLM), whereas the original translation model uses causal masking in the decoder to prevent looking ahead.",
  methodologyComparison: "Vaswani et al. employs an encoder-decoder network trained with supervised machine translation datasets (WMT 14) using label smoothing and dropout. Devlin et al. (BERT) employs a two-stage process: massive self-supervised pre-training on unlabeled corpora (BooksCorpus and Wikipedia) using Masked Language Modeling and Next Sentence Prediction, followed by a lightweight supervised fine-tuning stage for specific tasks.",
  conclusionsComparison: "The translation paper concludes that self-attention mechanisms alone can replace recurrent and convolutional layers, achieving faster training speeds and higher translation accuracy. BERT concludes that bidirectional contextual representations pre-trained on generic text are highly versatile and can easily adapt to set new state-of-the-art standards across virtually all language understanding benchmarks.",
  matrix: [
    {
      category: "Core Objective",
      "attention_all_you_need.pdf": "Introduce a translation model using self-attention to eliminate recurrent architectures.",
      "bert_transformer.pdf": "Pre-train deep bidirectional representations for highly generalizable NLP transfer learning."
    },
    {
      category: "Architecture",
      "attention_all_you_need.pdf": "Full Transformer Encoder-Decoder (Causal masked attention in decoder).",
      "bert_transformer.pdf": "Transformer Encoder layers only (Fully bidirectional self-attention)."
    },
    {
      category: "Primary Dataset",
      "attention_all_you_need.pdf": "Supervised WMT 2014 English-to-German (4.5M sentence pairs) & English-to-French.",
      "bert_transformer.pdf": "Unsupervised BooksCorpus (800M words) and English Wikipedia (2,500M words)."
    },
    {
      category: "Training Tasks",
      "attention_all_you_need.pdf": "Sequence-to-sequence translation (supervised teacher forcing).",
      "bert_transformer.pdf": "Masked Language Modeling (MLM) and Next Sentence Prediction (NSP)."
    },
    {
      category: "Key Innovation",
      "attention_all_you_need.pdf": "Multi-head self-attention replacing RNN/LSTM/CNN entirely.",
      "bert_transformer.pdf": "Unsupervised bidirectional pre-training enabling fast fine-tuning for down-stream NLP."
    },
    {
      category: "Main Limitation",
      "attention_all_you_need.pdf": "Quadratic complexity limits handling of very long contexts.",
      "bert_transformer.pdf": "[MASK] token mismatch between training and inference phases."
    }
  ]
};

export const DEMO_PAPERS: UploadedPaper[] = [
  {
    id: "attention_all_you_need",
    name: "attention_all_you_need.pdf",
    size: 2215432,
    type: "application/pdf",
    base64: "MOCK_ATTENTION_BASE64",
    summary: DEMO_SUMMARIES["attention_all_you_need"]
  },
  {
    id: "bert_transformer",
    name: "bert_transformer.pdf",
    size: 1845112,
    type: "application/pdf",
    base64: "MOCK_BERT_BASE64",
    summary: DEMO_SUMMARIES["bert_transformer"]
  }
];
