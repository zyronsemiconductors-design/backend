const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials. Please check your .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncOriginalContent() {
    console.log('🔄 Syncing original website content to CMS...\n');

    try {
        // ============ SYNC SOCIAL LINKS ============
        console.log('📱 Syncing social links...');
        const socialLinks = [
            { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61585946035332', display_order: 1, is_active: true, icon: 'facebook' },
            { platform: 'Instagram', url: 'https://www.instagram.com/zyronsemiconductors', display_order: 2, is_active: true, icon: 'instagram' },
            { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/zyronsemiconductors', display_order: 3, is_active: true, icon: 'linkedin' },
            { platform: 'Twitter', url: 'https://x.com/ZyronSemi', display_order: 4, is_active: true, icon: 'twitter' }
        ];

        const { error: socialError } = await supabase.from('social_links').delete().neq('id', 0);
        if (socialError) console.error('Error clearing social links:', socialError.message);

        const { error: socialInsertError } = await supabase.from('social_links').insert(socialLinks);
        if (socialInsertError) console.error('❌ Social links error:', socialInsertError.message);
        else console.log('✅ Social links synced successfully');

        // ============ SYNC SEO METADATA ============
        console.log('\n🏷️  Syncing SEO metadata...');
        const seoData = [
            {
                page_identifier: 'home',
                title: 'Zyron Semiconductors - Engineering the Silicon That Powers Tomorrow',
                description: 'Zyron Semiconductors delivers end-to-end semiconductor services including ASIC design, verification, and VLSI solutions for future-ready products.',
                keywords: 'semiconductors, ASIC design, VLSI, verification, FPGA, embedded systems, semiconductor engineering',
                og_title: 'Zyron Semiconductors - Semiconductor & VLSI Excellence',
                og_description: 'Engineering the Silicon That Powers Tomorrow'
            },
            {
                page_identifier: 'about',
                title: 'About Zyron Semiconductors - Technology & Engineering Services',
                description: 'Zyron Semiconductors is a technology and engineering services company delivering semiconductor, embedded, and digital solutions with focus on engineering excellence.',
                keywords: 'about zyron, semiconductor company, engineering services, VLSI company',
                og_title: 'About Zyron',
                og_description: 'Engineering Excellence, Innovation, and Long-term Partnerships'
            },
            {
                page_identifier: 'services',
                title: 'Our Services - Zyron Semiconductors',
                description: 'End-to-end engineering services including ASIC design, FPGA, embedded systems, software, and product engineering for scalable, future-ready solutions.',
                keywords: 'semiconductor services, ASIC design, FPGA, embedded systems, software engineering, product engineering',
                og_title: 'Zyron Services',
                og_description: 'Comprehensive Engineering Solutions'
            },
            {
                page_identifier: 'why-zyron',
                title: 'Why Partner with Zyron Semiconductors',
                description: 'Deep domain expertise, client-first mindset, and proven delivery models ensuring high-quality engineering outcomes that drive innovation and business success.',
                keywords: 'why choose zyron, semiconductor partner, engineering expertise',
                og_title: 'Why Zyron',
                og_description: 'Engineering Excellence That Drives Innovation'
            },
            {
                page_identifier: 'contact',
                title: 'Contact Zyron Semiconductors - Let\'s Talk',
                description: 'Have a design challenge or product idea? Connect with Zyron Semiconductors and let\'s engineer innovative solutions together.',
                keywords: 'contact zyron, semiconductor inquiry, engineering consultation',
                og_title: 'Contact Zyron',
                og_description: 'Let\'s Engineer Innovative Solutions Together'
            },
            {
                page_identifier: 'careers',
                title: 'Careers at Zyron Semiconductors - Build Your Career',
                description: 'Join Zyron and work alongside passionate engineers, solving real-world challenges and shaping the future of semiconductor and digital technologies.',
                keywords: 'zyron careers, semiconductor jobs, engineering careers, VLSI jobs',
                og_title: 'Careers at Zyron',
                og_description: 'Build Your Career With Us'
            },
            {
                page_identifier: 'community',
                title: 'Zyron Community - Connect & Innovate',
                description: 'A vibrant space for engineers, learners, and innovators to collaborate and grow in semiconductor and digital engineering.',
                keywords: 'zyron community, engineering community, semiconductor learning',
                og_title: 'Zyron Community',
                og_description: 'Connect, Learn, and Innovate Together'
            },
            {
                page_identifier: 'resources',
                title: 'Resources - Zyron Knowledge Center',
                description: 'Expert insights, technical guides, and learning materials to advance your semiconductor and engineering expertise.',
                keywords: 'semiconductor resources, VLSI guides, engineering learning',
                og_title: 'Zyron Resources',
                og_description: 'Learn. Build. Lead.'
            }
        ];

        const { error: seoError } = await supabase.from('seo_metadata').upsert(seoData);
        if (seoError) console.error('❌ SEO metadata error:', seoError.message);
        else console.log('✅ SEO metadata synced successfully');

        // ============ SYNC PAGE CONTENT ============
        console.log('\n📄 Syncing page content...');

        const pageContent = [
            // HOME PAGE
            {
                page_identifier: 'home',
                section_key: 'hero',
                content_type: 'json',
                content: [
                    {
                        id: '1',
                        title: "Engineering the Silicon That Powers Tomorrow",
                        subtitle: "Semiconductor & VLSI Excellence",
                        description: "Zyron Semiconductors delivers end-to-end semiconductor services including ASIC design, verification, and VLSI solutions to help you build high-performance, future-ready products.",
                        ctaText: "Explore Services",
                        imageUrl: "https://images.unsplash.com/photo-1651340741844-48edcd3fe79c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    },
                    {
                        id: '2',
                        title: "From Concept to Silicon",
                        subtitle: "Trusted Engineering Partner",
                        description: "We partner with global innovators to deliver reliable FPGA, backend, and verification services that accelerate time-to-market and reduce design risk.",
                        ctaText: "How We Work",
                        imageUrl: "https://images.unsplash.com/photo-1672307613484-3254a04651fd?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    },
                    {
                        id: '3',
                        title: "Scalable Solutions for a Digital World",
                        subtitle: "Innovation Meets Reliability",
                        description: "From embedded systems and firmware to software and product engineering, Zyron builds scalable solutions that power next-generation technologies.",
                        ctaText: "Start a Project",
                        imageUrl: "https://images.unsplash.com/photo-1640955785023-1854685dae05?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                ],
                is_published: true
            },
            {
                page_identifier: 'home',
                section_key: 'features',
                content_type: 'json',
                content: {
                    title: "OUR FEATURES",
                    subtitle: "Explore the strengths that make Zyron a trusted engineering partner for complex and mission-critical projects.",
                    list: [
                        {
                            id: "planning",
                            title: "Strategy & Planning",
                            description: "Clear technical roadmaps and execution plans aligned with your product goals and timelines."
                        },
                        {
                            id: "reliability",
                            title: "Engineering Reliability",
                            description: "Proven methodologies and rigorous reviews that ensure robust, high-quality design delivery."
                        },
                        {
                            id: "understanding",
                            title: "Domain Expertise",
                            description: "Deep understanding of ASIC, SoC, FPGA, and embedded systems across full development lifecycles."
                        },
                        {
                            id: "reusability",
                            title: "Accelerated Delivery",
                            description: "Reusable frameworks and best practices that reduce development cycles and engineering cost."
                        },
                        {
                            id: "scalability",
                            title: "Scalable Solutions",
                            description: "Architectures and teams designed to grow with your product roadmap and business needs."
                        },
                        {
                            id: "tracking",
                            title: "Transparent Execution",
                            description: "Clear milestones, progress visibility, and continuous communication throughout engagement."
                        }
                    ]
                },
                is_published: true
            },
            {
                page_identifier: 'home',
                section_key: 'services',
                content_type: 'json',
                content: {
                    title: "OUR SERVICES",
                    subtitle: "End-to-end engineering services that help you design, build, and scale future-ready semiconductor and digital products.",
                    list: [
                        {
                            id: "design",
                            title: "Semiconductor Engineering",
                            subtitle: "ASIC, SoC & VLSI",
                            description: "Complete semiconductor services including architecture, RTL design, synthesis, and physical implementation to deliver high-performance and low-power silicon solutions.",
                            image: "https://images.unsplash.com/photo-1666037801539-f30fd661657a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0"
                        },
                        {
                            id: "verification",
                            title: "Verification Services",
                            subtitle: "UVM & Validation",
                            description: "Comprehensive functional and formal verification using UVM methodologies to ensure first-time-right silicon and faster time-to-market.",
                            image: "https://images.unsplash.com/photo-1568209865332-a15790aed756?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0"
                        },
                        {
                            id: "fpga",
                            title: "FPGA & Emulation",
                            subtitle: "Prototyping & Debug",
                            description: "FPGA prototyping and emulation services for early validation, hardware-software co-verification, and risk reduction before tapeout.",
                            image: "https://images.unsplash.com/photo-1597862624146-142dbb8acfab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        },
                        {
                            id: "embedded",
                            title: "Embedded Systems",
                            subtitle: "Firmware & Drivers",
                            description: "Embedded firmware, BSP, and driver development enabling reliable and optimized integration of hardware and software platforms.",
                            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200"
                        }
                    ]
                },
                is_published: true
            },
            {
                page_identifier: 'home',
                section_key: 'about',
                content_type: 'json',
                content: {
                    title: "About Us",
                    subtitle: "Who We Are",
                    paragraphs: [
                        "Zyron Semiconductors is a technology and engineering services company powered by a team of passionate engineers delivering high-quality semiconductor, embedded, and digital solutions for global clients.",
                        "We specialize in end-to-end ASIC design, verification services, FPGA prototyping, and backend implementation, helping organizations transform ideas into reliable, production-ready silicon.",
                        "Driven by engineering excellence, collaboration, and innovation, we work as a true partner to our clients, enabling scalable and future-ready products across industries."
                    ],
                    skills: [
                        { name: "Semiconductor Design", value: 100 },
                        { name: "Verification Services", value: 100 },
                        { name: "FPGA / Emulation", value: 100 },
                        { name: "Backend & Physical Design", value: 100 }
                    ]
                },
                is_published: true
            },

            // ABOUT PAGE
            {
                page_identifier: 'about',
                section_key: 'mission',
                content_type: 'json',
                content: {
                    title: "About Company",
                    description: "Zyron Semiconductors is an ASIC IP and Design services company founded by a group of committed and experienced semiconductor industry professionals with a goal to provide end-to-end design and engineering services. We are driven to use the power of our global network to connect businesses with the right people, and people with the right businesses without bias. It is a leading service provider in VLSI by exceeding expectations on delivery, meeting stringent schedules, demonstrating integrity and intelligence in all our engagements. We offer a spectrum of design and verification services, which includes defining specification, logic partitioning, micro-architecture, RTL coding, synthesis, developing custom and standard VIPs and verification environment development using latest methodologies (UVM/OVM)."
                },
                is_published: true
            },

            // CONTACT PAGE
            {
                page_identifier: 'contact',
                section_key: 'contact_info',
                content_type: 'json',
                content: {
                    title: "Get in Touch",
                    formTitle: "Let's Start a Conversation",
                    address: {
                        label: "Head Office",
                        value: "18-8-40D/305, Madhura Nagar, Revenue Ward No: 8, Tirupati (U), Tirupati Dist."
                    },
                    emails: {
                        label: "Email Us",
                        general: "zyronsemiconductors@gmail.com",
                        hr: "HR@zyronsemi.com"
                    },
                    phone: {
                        label: "Call Us",
                        number: "+91 8123561362",
                        hours: "Monday to Friday, 9:00 AM – 6:00 PM IST"
                    },
                    website: {
                        label: "Website",
                        url: "https://www.zyronsemiconductors.com",
                        text: "www.zyronsemiconductors.com"
                    }
                },
                is_published: true
            },

            // WHY ZYRON PAGE
            {
                page_identifier: 'why-zyron',
                section_key: 'advantages',
                content_type: 'json',
                content: [
                    {
                        id: "strategy",
                        title: "Strategy & Planning",
                        content: [
                            "Every engagement begins with a clear technical and delivery roadmap aligned to your product vision and business goals.",
                            "Our planning approach helps define the right architecture, anticipate risks, and ensure predictable execution."
                        ]
                    },
                    {
                        id: "reliability",
                        title: "Engineering Reliability",
                        content: [
                            "We follow proven engineering processes to deliver robust, high-quality designs you can depend on.",
                            "Strong reviews and best practices help minimize defects, re-spins, and project uncertainties."
                        ]
                    },
                    {
                        id: "understanding",
                        title: "Deep Domain Expertise",
                        content: [
                            "Our teams bring hands-on experience across ASIC, SoC, FPGA, embedded systems, and software domains.",
                            "We understand system-level challenges and translate them into effective engineering solutions."
                        ]
                    },
                    {
                        id: "reusability",
                        title: "Accelerated Delivery",
                        content: [
                            "Reusable frameworks, IP blocks, and best practices help speed up development cycles.",
                            "This approach reduces engineering effort, cost, and time-to-market without compromising quality."
                        ]
                    },
                    {
                        id: "scalability",
                        title: "Scalable Engagements",
                        content: [
                            "Our solutions and team models are designed to scale with your evolving product roadmap.",
                            "From early-stage innovation to large programs, we grow alongside your business needs."
                        ]
                    },
                    {
                        id: "tracking",
                        title: "Transparent Execution",
                        content: [
                            "We ensure clear project visibility through defined milestones, metrics, and regular communication.",
                            "This transparency builds trust and keeps all stakeholders aligned throughout delivery."
                        ]
                    }
                ],
                is_published: true
            }
        ];

        const { error: contentError } = await supabase.from('page_content').upsert(pageContent, { onConflict: 'page_identifier,section_key' });
        if (contentError) console.error('❌ Page content error:', contentError.message);
        else console.log('✅ Page content synced successfully');

        console.log('\n🎉 Original content sync completed successfully!\n');
        console.log('✨ Your CMS now contains all the original website content!');
        console.log('\n📝 Next: Visit http://localhost:5173/admin/cms/pages to manage this content\n');

    } catch (error) {
        console.error('❌ Content sync failed:', error);
        process.exit(1);
    }
}

syncOriginalContent();
