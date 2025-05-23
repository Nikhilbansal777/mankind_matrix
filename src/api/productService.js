import axios from 'axios';
import { IS_DEV_MODE, API_TIMEOUT, getAxiosConfig } from './config';
import { APIError } from '../utils/errors';

// Configure axios defaults
axios.defaults.timeout = API_TIMEOUT;

// Consolidated mock products data for development
const mockProducts = [
  // Graphics Processing Units (GPUs)
  {
    id: 1,
    name: 'SpectraForce X Series',
    shortDescription: 'High-performance graphics cards for gaming and creative professionals.',
    longDescription: 'The SpectraForce X Series represents the pinnacle of gaming graphics technology. These cards deliver unparalleled performance for AAA gaming titles at 4K resolution with ray tracing enabled. Built on the latest architecture, they offer exceptional power efficiency while maintaining cool temperatures even under heavy loads.',
    price: '$799',
    category: 'GPUs',
    featured: true,
    imageUrl: 'https://m.media-amazon.com/images/I/71+PTOGv1mL.jpg',
    specifications: {
      'Memory': '12GB GDDR6X',
      'CUDA Cores': '5,888',
      'Base Clock': '1.5 GHz',
      'Boost Clock': '1.8 GHz',
      'TDP': '320W',
      'Recommended PSU': '750W',
      'Dimensions': '11.2 x 4.4 x 1.5 inches',
      'Weight': '1.2 kg'
    }
  },
  {
    id: 2,
    name: 'NovaCore Vision',
    shortDescription: 'Professional GPUs for workstations, 3D rendering, and CAD applications.',
    longDescription: 'NovaCore Vision cards are specially designed for content creators and professionals who demand reliability and performance. These workstation-class GPUs excel at 3D modeling, video editing, and complex CAD operations with certified drivers for all major professional applications.',
    price: '$999',
    category: 'GPUs',
    featured: false,
    imageUrl: 'https://i.extremetech.com/imagery/content-types/03jV5USras1qOUXTIGo7JIG/images-1.fill.size_670x377.v1691519408.png',
    specifications: {
      'Memory': '24GB GDDR6',
      'CUDA Cores': '4,608',
      'Base Clock': '1.3 GHz',
      'Boost Clock': '1.7 GHz',
      'TDP': '300W',
      'ECC Memory': 'Yes',
      'Dimensions': '12.5 x 5.5 x 1.7 inches',
      'Weight': '1.4 kg'
    }
  },
  {
    id: 3,
    name: 'ThunderCore AI GPU',
    shortDescription: 'High-performance GPUs for AI, machine learning, and data center applications.',
    price: '$1,499',
    category: 'GPUs',
    featured: false,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFqL92lAigcdIEnDZ8knLGr8LOfEu00cbvdg&s',
    longDescription: 'The ThunderCore AI GPU is designed specifically for high-throughput AI, machine learning, and data center workloads. With large memory bandwidth and optimized compute performance, it accelerates deep learning tasks and data processing tasks.',
    specifications: {
      'Memory': '32GB GDDR6X',
      'CUDA Cores': '6,144',
      'Base Clock': '1.4 GHz',
      'Boost Clock': '1.9 GHz',
      'TDP': '350W',
      'Recommended PSU': '850W',
      'Dimensions': '13 x 5.7 x 2.0 inches',
      'Weight': '1.8 kg'
    }
  },
  {
    id: 4,
    name: 'FusionRender Series',
    shortDescription: 'GPUs designed for HPC (high-performance computing) and AI model training.',
    price: '$2,000',
    category: 'GPUs',
    featured: true,
    imageUrl: 'https://www.networkworld.com/wp-content/uploads/2025/04/3966130-0-09907200-1745257104-original.jpg?quality=50&strip=all&w=1024',
    longDescription: 'FusionRender Series GPUs are engineered for the most demanding HPC and AI model training applications. These cards offer massive parallel processing power, ideal for simulations, large-scale model training, and scientific computing.',
    specifications: {
      'Memory': '48GB GDDR6',
      'CUDA Cores': '8,192',
      'Base Clock': '1.2 GHz',
      'Boost Clock': '1.6 GHz',
      'TDP': '450W',
      'Recommended PSU': '1000W',
      'Dimensions': '14 x 6 x 2.5 inches',
      'Weight': '2.2 kg'
    }
  },
  // AI Hardware
  {
    id: 5,
    name: 'QuantumMind Systems',
    shortDescription: 'AI supercomputing systems for deep learning and AI model training.',
    price: '$50,000',
    category: 'AI Hardware',
    featured: true,
    imageUrl: 'https://alleninstitute.org/wp-content/uploads/2024/05/Quantumconsciousness2-ezgif.com-crop.jpg',
    longDescription: 'QuantumMind Systems is a cutting-edge AI supercomputing platform, designed to accelerate deep learning and AI model training tasks. With multi-GPU configurations and optimized architecture, it empowers data scientists to handle complex workloads efficiently.',
    specifications: {
      'CPU': 'Dual Intel Xeon Gold 6230',
      'Memory': '1TB DDR4 ECC',
      'Storage': '10TB SSD',
      'GPU': '8 x NVIDIA Tesla A100',
      'Dimensions': '24 x 20 x 8 inches',
      'Weight': '60 kg'
    }
  },
  {
    id: 6,
    name: 'EdgeNexus Platform',
    shortDescription: 'AI-powered edge computing solutions for autonomous machines, robotics, and IoT devices.',
    price: '$10,000',
    category: 'AI Hardware',
    featured: false,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuOClJEpPkQssrdbTc-UKxEQPQPr2VWKxdMA&s',
    longDescription: 'EdgeNexus Platform is an AI-powered edge computing solution designed to optimize real-time data processing for IoT devices, robotics, and autonomous machines. It features low-latency computing and is ideal for edge AI deployments.',
    specifications: {
      'CPU': 'ARM Cortex-A76',
      'GPU': 'NVIDIA Jetson Xavier',
      'RAM': '32GB LPDDR4',
      'Storage': '256GB eMMC',
      'Dimensions': '8 x 5 x 3 inches',
      'Weight': '2.3 kg'
    }
  },
  // Featured Electronics from Carousel
  {
    id: 7,
    name: "RASPBERRY PI 4",
    shortDescription: "Single-board computer for DIY projects, learning programming, and everyday computing.",
    category: "SINGLE BOARD COMPUTERS",
    price: "$45.99",
    featured: true,
    imageUrl: "https://m.media-amazon.com/images/I/616RFn6Jv5L._AC_UF894,1000_QL80_DpWeblab_.jpg",
    longDescription: "The Raspberry Pi 4 is a versatile single-board computer ideal for DIY projects, education, and programming. With powerful features and connectivity, it can run multiple tasks simultaneously and is suitable for a range of applications.",
    specifications: {
      'CPU': 'Quad-core ARM Cortex-A72',
      'RAM': '4GB LPDDR4',
      'Storage': 'microSD card slot',
      'GPU': 'Broadcom VideoCore VI',
      'Dimensions': '3.4 x 2.2 x 1.1 inches',
      'Weight': '0.06 kg'
    }
  },
  {
    id: 8,
    name: "ARDUINO UNO",
    shortDescription: "Open-source electronics platform based on easy-to-use hardware and software.",
    category: "MICROCONTROLLERS",
    price: "$23.50",
    featured: true,
    imageUrl: "https://store.arduino.cc/cdn/shop/files/A000066_03.front_934x700.jpg?v=1727098250",
    longDescription: "The Arduino UNO is an open-source electronics platform used for building a wide range of interactive projects. With a microcontroller and simple programming environment, it's a great tool for beginners and advanced makers alike.",
    specifications: {
      'Microcontroller': 'ATmega328P',
      'Flash Memory': '32KB',
      'Clock Speed': '16 MHz',
      'Digital I/O Pins': '14',
      'Analog I/O Pins': '6',
      'Dimensions': '2.7 x 2.1 x 0.8 inches',
      'Weight': '0.025 kg'
    }
  },
  {
    id: 9,
    name: "NVIDIA JETSON",
    shortDescription: "AI computing platform for GPU-accelerated applications at the edge.",
    category: "EDGE AI COMPUTING",
    price: "$99.99",
    featured: true,
    imageUrl: "https://d29g4g2dyqv443.cloudfront.net/sites/default/files/akamai/embedded%2Fimages%2FjetsonNano%2Fjetson_orin_nano-devkit-front_top-right-trimmed.jpg",
    longDescription: "NVIDIA Jetson is an AI computing platform built for accelerating GPU-intensive applications at the edge. With its compact size and powerful capabilities, it is ideal for IoT, robotics, and AI at the edge.",
    specifications: {
      'CPU': 'Quad-core ARM Cortex-A57',
      'GPU': 'NVIDIA Maxwell',
      'RAM': '4GB LPDDR4',
      'Storage': '16GB eMMC',
      'Dimensions': '3.5 x 3.2 x 1.1 inches',
      'Weight': '0.3 kg'
    }
  },
  {
    id: 10,
    name: "ESP32 DEV KIT",
    shortDescription: "Development board for IoT applications with built-in Wi-Fi and Bluetooth.",
    category: "IOT DEVELOPMENT",
    price: "$12.95",
    featured: true,
    imageUrl: "https://m.media-amazon.com/images/I/61o2ZUzB4XL._AC_UF894,1000_QL80_.jpg",
    longDescription: "The ESP32 Dev Kit is a powerful development board for building IoT applications with Wi-Fi and Bluetooth. It features dual-core processing and a range of peripherals for rapid prototyping.",
    specifications: {
      'CPU': 'Dual-core Tensilica LX6',
      'RAM': '520KB SRAM',
      'Storage': '4MB Flash',
      'Wi-Fi': '802.11 b/g/n',
      'Bluetooth': 'v4.2',
      'Dimensions': '3.0 x 1.5 x 0.5 inches',
      'Weight': '0.02 kg'
    }
  },
  {
    id: 11,
    name: "TEENSY 4.1",
    shortDescription: "USB-based microcontroller development system for advanced electronics projects.",
    category: "MICROCONTROLLERS",
    price: "$29.95",
    featured: true,
    imageUrl: "https://ca.robotshop.com/cdn/shop/files/teensy-41-usb-microcontroller-development-board-no-pins-2_1024x.webp?v=1720518161",
    longDescription: "Teensy 4.1 is a USB-based development system with a powerful microcontroller that supports high-speed processing. It is ideal for audio processing, robotics, and advanced electronics projects.",
    specifications: {
      'Microcontroller': 'ARM Cortex-M7',
      'Flash Memory': '8MB',
      'Clock Speed': '600 MHz',
      'Digital I/O Pins': '55',
      'Dimensions': '2.4 x 1.4 x 0.3 inches',
      'Weight': '0.02 kg'
    }
  },
  // More products from ProductGrid
  {
    id: 12,
    name: 'NeuraFlow Suite',
    shortDescription: 'A parallel computing platform and API designed for accelerating AI and data-heavy workloads.',
    price: '$699',
    category: 'AI Hardware',
    featured: false,
    imageUrl: 'https://framerusercontent.com/images/b1WgDKAkCoPT9IqxSwrM7xfxMl8.png',
    longDescription: 'NeuraFlow Suite is a high-performance parallel computing platform and API built for accelerating AI workloads and large-scale data processing tasks. It provides efficient processing pipelines for AI systems.',
    specifications: {
      'CPU': 'Dual Intel Xeon',
      'GPU': 'NVIDIA Tesla V100',
      'RAM': '128GB DDR4',
      'Storage': '5TB SSD',
      'Dimensions': '18 x 10 x 7 inches',
      'Weight': '15 kg'
    }
  },
  {
    id: 13,
    name: 'DeepStream AI Studio',
    shortDescription: 'A platform for creating AI-based video analytics applications for industries like retail, security, and automotive.',
    price: '$999',
    category: 'AI Hardware',
    featured: false,
    imageUrl: 'https://wpforms.com/wp-content/uploads/2024/08/google-ai-studio-logo.png',
    longDescription: 'DeepStream AI Studio offers tools to build scalable AI-based video analytics applications for real-time processing in industries like retail, automotive, and security.',
    specifications: {
      'CPU': 'Intel i7',
      'GPU': 'NVIDIA RTX 3080',
      'RAM': '16GB DDR4',
      'Storage': '1TB NVMe SSD',
      'Dimensions': '16 x 8 x 5 inches',
      'Weight': '10 kg'
    }
  }
];

// Production API calls
export const getAllProducts = async (page = 0, size = 10) => {
  try {
    if (IS_DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const start = page * size;
      const end = start + size;
      const paginatedProducts = mockProducts.slice(start, end);
      
      return {
        content: paginatedProducts,
        totalElements: mockProducts.length,
        totalPages: Math.ceil(mockProducts.length / size),
        size,
        number: page
      };
    }
    
    const res = await axios.get(`/products`, getAxiosConfig({
      params: { page, size }
    }));
    return res.data;
  } catch (error) {
    throw APIError.fromAxiosError(error, '/products');
  }
};

export const getFeaturedProducts = async () => {
  try {
    if (IS_DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const featuredProducts = mockProducts.filter(product => product.featured);
      return featuredProducts;
    }
    
    const res = await axios.get(`/products/featured`, getAxiosConfig());
    return res.data;
  } catch (error) {
    throw APIError.fromAxiosError(error, '/products/featured');
  }
};

export const getProductById = async (id) => {
  try {
    if (IS_DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const product = mockProducts.find(p => p.id.toString() === id.toString());
      
      if (!product) {
        throw new APIError(
          404,
          'Product not found',
          `/products/${id}`,
          `No product found with id: ${id}`
        );
      }
      
      return product;
    }
    
    const res = await axios.get(`/products/${id}`, getAxiosConfig({
      headers: {
        'Cache-Control': 'no-cache',
      }
    }));
    return res.data;
  } catch (error) {
    throw APIError.fromAxiosError(error, `/products/${id}`);
  }
};
  
