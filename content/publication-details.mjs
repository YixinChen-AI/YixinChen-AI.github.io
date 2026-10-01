// The order follows the five peer-reviewed year groups in publications.*.html.
// A missing image is intentional: do not substitute an unrelated paper's figure.
export const publicationDetails = [
  {
    id: 'masld', match: 'Whole-Body', image: 'masld.webp', source: null,
    en: 'Whole-body FDG PET/CT is used to examine metabolic changes across organs in MASLD.',
    zh: '利用全身 FDG PET/CT 分析 MASLD 患者多个器官的代谢变化。',
    authors: 'Yixin Chen, Chuanzhi Zhou, Lijuan Guo, Huiling Duan, Fengjuan Li, Lihong Yang, Yanhua Duan, Hui Li, Ruoyan Xu, Zhaoping Cheng, Zhaoheng Xie',
  },
  {
    id: 'neuronctrl', match: 'NeuronCtrl:', image: 'neuronctrl.webp', source: 'https://proceedings.mlr.press/v306/xu26d.html',
    en: 'NeuronCtrl combines a generative model with closed-loop control to guide neuronal microenvironment dynamics.',
    zh: 'NeuronCtrl 将生成模型与闭环控制结合，用于调节神经元微环境的动态变化。',
  },
  {
    id: 'kinetic-inference', match: 'Neural Network Approximation', image: null,
    en: 'A neural approximation of compartment-model equations is used to infer kinetic parameters from dynamic PET.',
    zh: '用神经网络近似房室模型方程，从动态 PET 数据推断动力学参数。',
  },
  {
    id: 'phate-net', match: 'PHATE-Net:', image: 'phate.webp', source: 'https://openaccess.thecvf.com/content/CVPR2026F/papers/Chen_PHATE-Net_Differentiable_Pseudotime_Learning_for_Trustworthy_Disease_Trajectories_in_PET_CVPRF_2026_paper.pdf',
    en: 'PHATE-Net learns a disease progression timeline from PET images by making pseudotime estimation differentiable.',
    zh: 'PHATE-Net 通过可微的伪时间估计，从 PET 图像学习疾病进展轨迹。',
  },
  {
    id: 'mpum', match: 'Modality-projection', image: 'mpum.webp', source: 'https://www.nature.com/articles/s41467-025-64469-w', license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    en: 'A modality-projection model segments anatomical structures across whole-body medical images.',
    zh: '通过模态投影模型，对多种全身医学影像中的解剖结构进行分割。',
  },
  {
    id: 'vp-sfda', match: 'VP-SFDA:', image: 'vpsfda.webp', source: 'https://doi.org/10.34133/hds.0143',
    en: 'Visual prompts help adapt a segmentation model to a new imaging modality without access to the source data.',
    zh: '利用视觉提示，在不访问源域数据的情况下将分割模型适配到新影像模态。',
  },
  {
    id: 'pet-patlak', match: 'Neural network-aided', image: 'pet-patlak.webp', source: 'https://doi.org/10.1186/s40658-025-00804-w',
    en: 'A neural network estimates the missing input function needed for Patlak analysis from dual-time-window PET scans.',
    zh: '利用神经网络估计双时间窗 PET 中缺失的输入函数，以完成 Patlak 分析。',
  },
  {
    id: 'neural-operator', match: 'A Physiology-Supervised', image: null,
    en: 'A physiology-supervised neural operator estimates kinetic parameters from dynamic PET data.',
    zh: '利用生理监督的神经算子，从动态 PET 数据估计动力学参数。',
  },
  {
    id: 'pcnet', match: 'PCNet:', image: 'pcnet.webp', source: 'https://github.com/YixinChen-AI/PCNet',
    en: 'PCNet uses prior anatomical categories to guide universal segmentation of CT structures.',
    zh: 'PCNet 利用解剖类别先验，引导 CT 图像中的通用结构分割。',
  },
  {
    id: 'lucida', match: 'LUCIDA:', image: 'lucida.webp', source: 'https://papers.miccai.org/miccai-2024/483-Paper0562.html',
    en: 'LUCIDA adapts segmentation to low-dose CT images across multiple tissues.',
    zh: 'LUCIDA 面向低剂量 CT 的跨组织分割，处理图像域变化。',
  },
  {
    id: 'braseda', match: 'Structure-Enhanced', image: null,
    en: 'Structure-aware domain adaptation is applied to whole-brain CT segmentation.',
    zh: '将结构信息融入无监督域适应，用于全脑 CT 分割。',
  },
  {
    id: 'dual-window', match: 'Neural Network-Asissted', image: null,
    en: 'A neural model reconstructs the incomplete input function in dual-time-window PET for Patlak analysis.',
    zh: '针对双时间窗 PET 中不完整的输入函数，用神经模型支持 Patlak 分析。',
  },
  {
    id: 'fvp', match: 'FVP:', image: 'fvp.webp', source: 'https://arxiv.org/abs/2304.13672',
    en: 'Fourier-domain visual prompts adapt medical image segmentation when source-domain data are unavailable.',
    zh: '利用傅里叶域的视觉提示，在无源域数据的条件下适配医学图像分割模型。',
  },
  {
    id: 'rethink-disentanglement', match: 'Rethinking Disentanglement', image: 'rethink.webp', source: 'https://microsites.arinex.com.au/EMBC/pdf/full-paper_789.pdf',
    en: 'The paper revisits feature disentanglement for unsupervised domain adaptation in medical segmentation.',
    zh: '重新审视特征解耦在医学图像分割无监督域适应中的作用。',
  },
  {
    id: 'atrial-septal', match: 'Echocardiography-based AI for detection', image: 'atrial-septal.webp', source: 'https://doi.org/10.3389/fcvm.2023.985657',
    en: 'Echocardiography-based AI detects atrial septal defects and quantifies their size.',
    zh: '利用超声心动图和人工智能识别房间隔缺损，并量化缺损大小。',
    authors: 'Xixiang Lin, Feifei Yang, Yixin Chen, Xu Chen, Wenjun Wang, Wenxiu Li, Qiushuang Wang, Liwei Zhang, Xin Li, Yujiao Deng, Haitao Pu, Xiaotian Chen, Xiao Wang, Dong Luo, Peifang Zhang, Daniel Burkhoff, Kunlun He',
  },
  {
    id: 'msgan', match: 'MSGAN:', image: null,
    en: 'A multi-stage generative adversarial network addresses cross-modality domain adaptation for medical images.',
    zh: '利用多阶段生成对抗网络，处理医学影像跨模态域适应。',
  },
  {
    id: 'adnexal', match: 'A deep learning model system', image: 'adnexal.webp', source: 'https://doi.org/10.3390/cancers14215291',
    en: 'A deep-learning system analyzes ultrasound images to support the diagnosis and management of adnexal masses.',
    zh: '利用深度学习分析超声图像，辅助附件肿块的诊断和管理。',
    authors: 'Jianan Li, Yixin Chen, Minyu Zhang, Peifang Zhang, Kunlun He, Fengqin Yan, Jingbo Li, Hong Xu, Daniel Burkhoff, Yukun Luo, Longxia Wang, Qiuyang Li',
  },
  {
    id: 'myocardial-infarction', match: 'Echocardiography-based AI detection', image: 'myocardial-infarction.webp', source: 'https://doi.org/10.3389/fcvm.2022.903660',
    en: 'An echocardiography-based AI system detects regional wall-motion abnormalities and measures cardiac function after myocardial infarction.',
    zh: '利用超声心动图和人工智能识别心肌梗死后的局部室壁运动异常，并量化心功能。',
    authors: 'Xixiang Lin, Feifei Yang, Yixin Chen, Xiaotian Chen, Wenjun Wang, Xu Chen, Qiushuang Wang, Liwei Zhang, Huayuan Guo, Bohan Liu, Liheng Yu, Haitao Pu, Peifang Zhang, Zhenzhou Wu, Xin Li, Daniel Burkhoff, Kunlun He',
  },
];
