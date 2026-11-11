export const initialSeedData = {
  profiles: [
    {
      id: 'usr-admin-01',
      email: 'admin@mite.ac.in',
      full_name: 'Dr. C. R. Rajashekhar',
      usn: 'FAC-MTR-01',
      department: 'Mechatronics Engineering',
      semester: 8,
      role: 'club_admin',
      skills: ['Embedded Systems', 'Robotics & Control', 'PLC Automation', 'Academic Mentorship'],
      bio: 'Faculty Advisor & Chief Administrator of MECHANEXUS Mechatronics Club at MITE.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      is_public: true
    },
    {
      id: 'usr-coord-01',
      email: 'ananya.rao@mite.ac.in',
      full_name: 'Ananya Rao',
      usn: '4MT22MT012',
      department: 'Mechatronics Engineering',
      semester: 7,
      role: 'coordinator',
      skills: ['Project Coordination', 'ROS 2', 'Computer Vision', 'Event Management'],
      bio: 'Head Student Coordinator. Overseeing workshops, logistics, and task allocations across club verticals.',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      is_public: true
    },
    {
      id: 'usr-lead-01',
      email: 'rahul.sharma@mite.ac.in',
      full_name: 'Rahul Sharma',
      usn: '4MT23MT045',
      department: 'Mechatronics Engineering',
      semester: 5,
      role: 'team_leader',
      skills: ['SolidWorks', 'MATLAB/Simulink', 'BLDC Motor Control', '3D Rapid Prototyping'],
      bio: 'Team Lead for Autonomous Rover Vertical. Passionate about planetary exploration robotics.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      is_public: true
    },
    {
      id: 'usr-stud-01',
      email: 'preethi.nayak@mite.ac.in',
      full_name: 'Preethi Nayak',
      usn: '4MT24MT028',
      department: 'Mechatronics Engineering',
      semester: 3,
      role: 'student',
      skills: ['Arduino', 'Sensor Interfacing', 'C++', 'Circuit Design'],
      bio: 'Sophomore enthusiast working on sensor fusion and autonomous obstacle detection.',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250',
      is_public: true
    },
    {
      id: 'usr-stud-02',
      email: 'karthik.bhat@mite.ac.in',
      full_name: 'Karthik Bhat',
      usn: '4MT24MT019',
      department: 'Mechatronics Engineering',
      semester: 3,
      role: 'student',
      skills: ['Python', 'OpenCV', 'Raspberry Pi'],
      bio: 'Focusing on edge computing and vision-guided robotic arms.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      is_public: true
    },
    {
      id: 'usr-stud-03',
      email: 'sneha.hegde@mite.ac.in',
      full_name: 'Sneha Hegde',
      usn: '4MT23MT051',
      department: 'Mechatronics Engineering',
      semester: 5,
      role: 'student',
      skills: ['PCB Design (KiCAD)', 'Power Electronics', 'STM32'],
      bio: 'Hardware engineer specializing in custom motor driver board fabrication.',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
      is_public: true
    },
    {
      id: 'usr-stud-04',
      email: 'rohan.dsouza@mite.ac.in',
      full_name: 'Rohan D\'Souza',
      usn: '4MT24MT040',
      department: 'Mechatronics Engineering',
      semester: 3,
      role: 'student',
      skills: ['Fusion 360', 'FEA Analysis', '3D Printing'],
      bio: 'Mechanical design member interested in lightweight drone chassis.',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
      is_public: true
    }
  ],

  teams: [
    {
      id: 'team-01',
      name: 'Team MechaRover',
      team_code: 'ROV2026',
      domain: 'Autonomous Mobile Robotics',
      description: 'Developing multi-terrain exploration rover with rockerbogie suspension and LiDAR mapping.',
      leader_id: 'usr-lead-01',
      created_by: 'usr-admin-01',
      created_at: '2026-08-15T10:00:00Z',
      members: ['usr-lead-01', 'usr-stud-01', 'usr-stud-03']
    },
    {
      id: 'team-02',
      name: 'AeroMecha Drones',
      team_code: 'AERO99',
      domain: 'Aerial Robotics & UAVs',
      description: 'Building custom quadcopters and hexacopters equipped with thermal vision for agricultural surveying.',
      leader_id: 'usr-coord-01',
      created_by: 'usr-coord-01',
      created_at: '2026-09-01T11:30:00Z',
      members: ['usr-coord-01', 'usr-stud-04']
    },
    {
      id: 'team-03',
      name: 'RoboArm Automation',
      team_code: 'ARM404',
      domain: 'Industrial Automation & Manipulation',
      description: '6-Axis articulated robotic arm with pneumatic pick-and-place end-effector and inverse kinematics.',
      leader_id: 'usr-stud-02',
      created_by: 'usr-admin-01',
      created_at: '2026-09-10T14:00:00Z',
      members: ['usr-stud-02']
    }
  ],

  projects: [
    {
      id: 'proj-01',
      team_id: 'team-01',
      title: 'Autonomous Terrain Exploration Rover (AX-1)',
      category: 'Robotics',
      status: 'Prototyping',
      problem_statement: 'Navigation in uneven, unstructured agricultural terrains without GPS signal requires robust mechanical suspension and real-time visual-inertial odometry.',
      proposed_solution: 'A 6-wheel rocker-bogie chassis equipped with stereo camera, RPLiDAR A1, wheel encoders, and ROS2 Nav2 stack for autonomous obstacle avoidance.',
      estimated_budget: 45000,
      actual_expenditure: 32400,
      documents: [
        { name: 'AX1_Mechanical_Design_Specs.pdf', size: '2.4 MB', date: '2026-09-14' },
        { name: 'ROS2_Navigation_Architecture.pdf', size: '1.8 MB', date: '2026-10-02' }
      ],
      images: [
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'
      ],
      components: [
        { id: 'c1', name: 'RPLiDAR A1 360-degree Laser Scanner', quantity: 1, specifications: '12m range, 5.5Hz scan rate', estimated_cost: 9500, is_acquired: true },
        { id: 'c2', name: 'Nvidia Jetson Orin Nano Developer Kit', quantity: 1, specifications: '40 TOPS AI, 8GB RAM', estimated_cost: 24000, is_acquired: true },
        { id: 'c3', name: 'High Torque Planetary DC Motors (12V 200RPM)', quantity: 6, specifications: '15 kg-cm torque with quadrature encoders', estimated_cost: 7200, is_acquired: true },
        { id: 'c4', name: '6S LiPo Battery 5000mAh 60C', quantity: 2, specifications: '22.2V high-discharge power pack', estimated_cost: 4300, is_acquired: false }
      ],
      history: [
        { id: 'h1', modified_by: 'usr-lead-01', field_changed: 'status', old_value: 'Ideation', new_value: 'Prototyping', created_at: '2026-09-20T10:15:00Z' },
        { id: 'h2', modified_by: 'usr-admin-01', field_changed: 'estimated_budget', old_value: '40000', new_value: '45000', created_at: '2026-10-01T14:22:00Z' }
      ],
      created_by: 'usr-lead-01',
      created_at: '2026-08-25T09:00:00Z'
    },
    {
      id: 'proj-02',
      team_id: 'team-03',
      title: 'Pneumatic 6-DOF Industrial Sorting Arm',
      category: 'Industrial Automation',
      status: 'Testing',
      problem_statement: 'Small scale packaging factories struggle with the high cost of imported sorting cells for fragile agricultural products.',
      proposed_solution: 'An affordable 3D-printed and aluminum link 6-axis manipulator controlled by an STM32 MCU running inverse kinematics with pneumatic vacuum gripper.',
      estimated_budget: 28000,
      actual_expenditure: 26500,
      documents: [
        { name: 'Forward_Inverse_Kinematics_Calculations.pdf', size: '3.1 MB', date: '2026-09-18' }
      ],
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
      ],
      components: [
        { id: 'c5', name: 'NEMA 23 Stepper Motors + TB6600 Drivers', quantity: 3, specifications: '2.5Nm holding torque', estimated_cost: 6500, is_acquired: true },
        { id: 'c6', name: 'Miniature 12V Vacuum Suction Pump + Solenoid Valve', quantity: 1, specifications: '-60kPa negative pressure', estimated_cost: 2200, is_acquired: true }
      ],
      history: [
        { id: 'h3', modified_by: 'usr-stud-02', field_changed: 'status', old_value: 'Prototyping', new_value: 'Testing', created_at: '2026-10-18T16:30:00Z' }
      ],
      created_by: 'usr-stud-02',
      created_at: '2026-09-12T11:00:00Z'
    }
  ],

  communityPosts: [
    {
      id: 'post-01',
      author_id: 'usr-admin-01',
      title: '🏆 MECHANEXUS Wins National Robotics Championship at TechFest 2026',
      content: 'We are thrilled to announce that Team MechaRover secured 1st place in the Autonomous Rover Challenge! The team demonstrated real-time SLAM in GPS-denied environments. Hearty congratulations to our dedicated student innovators!',
      category: 'achievement',
      image_url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&q=80&w=1000',
      is_pinned: true,
      created_at: '2026-10-28T09:00:00Z'
    },
    {
      id: 'post-02',
      author_id: 'usr-coord-01',
      title: '🚀 Hands-on Workshop: ROS2 & Simulation in NVIDIA Isaac Sim',
      content: 'Join us this Saturday in Mechatronics CAD Lab (Room 302). We will cover ROS2 nodes, URDF robot modeling, and physics-driven simulation. Registration is mandatory for 2nd and 3rd year members.',
      category: 'workshop',
      image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000',
      is_pinned: true,
      event_date: '2026-11-20T10:00:00Z',
      created_at: '2026-11-02T14:30:00Z'
    },
    {
      id: 'post-03',
      author_id: 'usr-lead-01',
      title: '⚡ Project Showcase: Telemetry Test of AX-1 Planetary Chassis',
      content: 'The new lightweight carbon-fiber composite links for our rocker-bogie rover passed structural load tests with a 2.5x safety factor. Next step: motor driver integration and field testing in beach terrain.',
      category: 'project_showcase',
      image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1000',
      is_pinned: false,
      created_at: '2026-11-05T11:20:00Z'
    }
  ],

  tasks: [
    {
      id: 'task-01',
      title: 'MITE Alumni Industry Sponsorship Outreach 2026',
      description: 'Contact prominent alumni in mechatronics, automotive, and automation industries for project sponsorship and guest lecture invitations.',
      deadline: '2026-11-25T18:00:00Z',
      created_by: 'usr-coord-01',
      total_records: 12,
      completed_records: 5,
      status: 'In Progress',
      source_filename: 'Alumni_Directory_Batch_2015_2022.xlsx',
      created_at: '2026-11-08T09:00:00Z',
      assignments: [
        { student_id: 'usr-stud-01', allocated_count: 3, completed_count: 2 },
        { student_id: 'usr-stud-02', allocated_count: 3, completed_count: 1 },
        { student_id: 'usr-stud-03', allocated_count: 3, completed_count: 1 },
        { student_id: 'usr-stud-04', allocated_count: 3, completed_count: 1 }
      ],
      records: [
        {
          id: 'rec-01',
          assigned_to: 'usr-stud-01',
          name: 'Naveen Hegde',
          phone: '+91 98450 12345',
          email: 'naveen.hegde@bosch.com',
          role_or_work: 'Lead Engineer at Bosch Mobility',
          notes: 'Alumnus 2017, specialize in ECU hardware.',
          status: 'Completed',
          student_notes: 'Spoke with Naveen sir; agreed to sponsor rover sensors! Sent proposal.'
        },
        {
          id: 'rec-02',
          assigned_to: 'usr-stud-01',
          name: 'Shwetha Kamath',
          phone: '+91 97412 87654',
          email: 'shwetha.k@ti.com',
          role_or_work: 'Senior Applications Engr, Texas Instruments',
          notes: 'Alumna 2019, motor control ICs.',
          status: 'Completed',
          student_notes: 'Confirmed guest session on PMIC design for Nov 28.'
        },
        {
          id: 'rec-03',
          assigned_to: 'usr-stud-01',
          name: 'Varun Poojary',
          phone: '+91 94801 55432',
          email: 'varun.p@abb.com',
          role_or_work: 'Robotics Project Lead, ABB Bangalore',
          notes: 'Alumnus 2018.',
          status: 'In Progress',
          student_notes: 'Left voicemail and sent introductory club email.'
        },
        {
          id: 'rec-04',
          assigned_to: 'usr-stud-02',
          name: 'Deepak Kulal',
          phone: '+91 99014 33211',
          email: 'deepak.k@larsentoubro.com',
          role_or_work: 'Systems Engineer at L&T Defence',
          notes: 'Alumnus 2016.',
          status: 'Completed',
          student_notes: 'Agreed to review our chassis FEA analysis.'
        },
        {
          id: 'rec-05',
          assigned_to: 'usr-stud-02',
          name: 'Divya Alva',
          phone: '+91 98860 77123',
          email: 'divya.alva@tcs.com',
          role_or_work: 'IoT Architect, TCS Engineering',
          notes: 'Alumna 2020.',
          status: 'Unable to Contact',
          student_notes: 'Phone switched off, sent LinkedIn message.'
        },
        {
          id: 'rec-06',
          assigned_to: 'usr-stud-02',
          name: 'Gaurav Shenoy',
          phone: '+91 94481 99087',
          email: 'gaurav.s@toyota-kirloskar.com',
          role_or_work: 'Automation Engineer, Toyota',
          notes: 'Alumnus 2015.',
          status: 'Needs Assistance',
          student_notes: 'Requested official sponsorship letter signed by HOD.'
        },
        {
          id: 'rec-07',
          assigned_to: 'usr-stud-03',
          name: 'Manish Shetty',
          phone: '+91 91480 22345',
          email: 'manish.s@atherenergy.com',
          role_or_work: 'Battery Systems Engineer, Ather',
          notes: 'Alumnus 2021.',
          status: 'Completed',
          student_notes: 'Will donate tested Li-Ion 18650 cells for club lab.'
        },
        {
          id: 'rec-08',
          assigned_to: 'usr-stud-03',
          name: 'Pooja Salian',
          phone: '+91 96112 44321',
          email: 'pooja.s@continental.com',
          role_or_work: 'ADAS Algorithm Developer, Continental',
          notes: 'Alumna 2019.',
          status: 'In Progress',
          student_notes: 'Meeting scheduled for tomorrow 4 PM.'
        },
        {
          id: 'rec-09',
          assigned_to: 'usr-stud-03',
          name: 'Ranjith Rai',
          phone: '+91 94490 88765',
          email: 'ranjith.r@honeywell.com',
          role_or_work: 'Avionics Engineer, Honeywell',
          notes: 'Alumnus 2016.',
          status: 'Not Started',
          student_notes: ''
        },
        {
          id: 'rec-10',
          assigned_to: 'usr-stud-04',
          name: 'Smitha Rao',
          phone: '+91 99451 11234',
          email: 'smitha.rao@siemens.com',
          role_or_work: 'Digital Enterprise Consultant, Siemens',
          notes: 'Alumna 2017.',
          status: 'Completed',
          student_notes: 'Offered free Siemens Mechatronics software licenses!'
        },
        {
          id: 'rec-11',
          assigned_to: 'usr-stud-04',
          name: 'Vikas Acharya',
          phone: '+91 98802 33456',
          email: 'vikas.a@olaelectric.com',
          role_or_work: 'Vehicle Integration Lead, Ola Electric',
          notes: 'Alumnus 2018.',
          status: 'Not Started',
          student_notes: ''
        },
        {
          id: 'rec-12',
          assigned_to: 'usr-stud-04',
          name: 'Yashaswini K',
          phone: '+91 97400 99887',
          email: 'yashaswini.k@fanuc.co.in',
          role_or_work: 'Robotics Application Specialist, FANUC',
          notes: 'Alumna 2020.',
          status: 'Not Started',
          student_notes: ''
        }
      ]
    }
  ],

  events: [
    {
      id: 'event-01',
      title: 'MECHAHACK 2026: 24-Hour Hardware & Robotics Hackathon',
      description: 'Annual flagship hackathon of MECHANEXUS featuring tracks in Autonomous Vehicles, Agritech Automation, and Wearable Exoskeletons. Kits and mentor support provided.',
      event_date: '2026-12-10T09:00:00Z',
      venue: 'MITE Incubation Center & Audi 2',
      banner_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000',
      status: 'Upcoming',
      schedule: [
        { time: '09:00 AM', activity: 'Registration & Kit Distribution' },
        { time: '10:30 AM', activity: 'Problem Statements Reveal & Hacking Begins' },
        { time: '04:00 PM', activity: 'Mentor Review 1' },
        { time: '10:00 AM (+1)', activity: 'Final Demo & Jury Evaluation' }
      ],
      responsibilities: [
        { id: 'er-1', student_id: 'usr-stud-01', area: 'Technical & Component Kits', duty_details: 'Verify and bundle Arduino/ESP32 kits, motors, and breadboards.', is_completed: true },
        { id: 'er-2', student_id: 'usr-stud-02', area: 'Stage & Audio/Visual', duty_details: 'Coordinate projection screen and livestream in Audi 2.', is_completed: false },
        { id: 'er-3', student_id: 'usr-stud-03', area: 'Guest Reception & Food', duty_details: 'Coordinate industry judge transport and refreshment tables.', is_completed: false }
      ],
      created_by: 'usr-coord-01',
      created_at: '2026-10-15T10:00:00Z'
    },
    {
      id: 'event-02',
      title: 'Industrial PLC & SCADA Workshop with Delta Automation',
      description: 'Three-day certification boot camp on industrial ladder logic, HMI interfacing, and servo drive tuning.',
      event_date: '2026-11-28T09:30:00Z',
      venue: 'Mechatronics Automation Lab (Room 214)',
      banner_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=1000',
      status: 'Upcoming',
      schedule: [
        { time: '09:30 AM - 12:30 PM', activity: 'PLC Hardware & Ladder Logic Basics' },
        { time: '01:30 PM - 04:30 PM', activity: 'Hands-on SCADA Design & HMI Integration' }
      ],
      responsibilities: [
        { id: 'er-4', student_id: 'usr-stud-04', area: 'Lab Readiness', duty_details: 'Check all 30 Delta PLC trainer kits and ISPSoft installations.', is_completed: true }
      ],
      created_by: 'usr-admin-01',
      created_at: '2026-11-01T12:00:00Z'
    }
  ],

  membershipApplications: [
    {
      id: 'app-01',
      full_name: 'Aditya Shenoy',
      email: 'aditya.shenoy@mite.ac.in',
      usn: '4MT25MT005',
      department: 'Mechatronics Engineering',
      semester: 1,
      technical_interests: ['Embedded C', 'Robotic Arms', 'Drone Flight Controllers'],
      skills_description: 'Built an obstacle-avoiding car using Arduino in school; keen to learn ROS 2 and join the Rover vertical.',
      status: 'pending',
      created_at: '2026-11-09T14:15:00Z'
    },
    {
      id: 'app-02',
      full_name: 'Meghana Rao',
      email: 'meghana.rao@mite.ac.in',
      usn: '4MT24EC042',
      department: 'Electronics & Communication',
      semester: 3,
      technical_interests: ['Computer Vision', 'Edge AI', 'PCB Design'],
      skills_description: 'Comfortable with Python and OpenCV. Worked on face tracking and YOLOv8 on Jetson Nano.',
      status: 'pending',
      created_at: '2026-11-10T11:45:00Z'
    },
    {
      id: 'app-03',
      full_name: 'Chandan Kumar',
      email: 'chandan.k@mite.ac.in',
      usn: '4MT24ME015',
      department: 'Mechanical Engineering',
      semester: 3,
      technical_interests: ['SolidWorks', '3D Printing', 'Structural FEA'],
      skills_description: 'Designed chassis models in Fusion 360 for high-school science exhibitions. Eager to contribute to CAD modeling.',
      status: 'approved',
      reviewed_by: 'usr-admin-01',
      reviewed_at: '2026-11-08T16:00:00Z',
      admin_notes: 'Approved for mechanical design team. Highly enthusiastic.',
      created_at: '2026-11-06T09:30:00Z'
    }
  ],

  activityLogs: [
    {
      id: 'log-01',
      user_id: 'usr-admin-01',
      action_type: 'PROJECT_BUDGET_UPDATE',
      entity_type: 'PROJECT',
      entity_id: 'proj-01',
      details: 'Approved budget expansion to ₹45,000 for RPLiDAR A1 and motor driver fabrication.',
      created_at: '2026-10-01T14:22:00Z'
    },
    {
      id: 'log-02',
      user_id: 'usr-coord-01',
      action_type: 'TASK_DISTRIBUTED',
      entity_type: 'TASK',
      entity_id: 'task-01',
      details: 'Parsed Alumni_Directory_Batch_2015_2022.xlsx and distributed 12 alumni contacts across 4 students equally.',
      created_at: '2026-11-08T09:00:00Z'
    },
    {
      id: 'log-03',
      user_id: 'usr-stud-01',
      action_type: 'TASK_RECORD_COMPLETED',
      entity_type: 'TASK_RECORD',
      entity_id: 'rec-01',
      details: 'Marked alumni Naveen Hegde (Bosch) as Completed with sponsorship commitment.',
      created_at: '2026-11-09T10:30:00Z'
    },
    {
      id: 'log-04',
      user_id: 'usr-admin-01',
      action_type: 'MEMBERSHIP_APPLICATION_APPROVED',
      entity_type: 'APPLICATION',
      entity_id: 'app-03',
      details: 'Approved membership application for Chandan Kumar (Mechanical Engg, 3rd Sem).',
      created_at: '2026-11-08T16:00:00Z'
    },
    {
      id: 'log-05',
      user_id: 'usr-coord-01',
      action_type: 'EVENT_CREATED',
      entity_type: 'EVENT',
      entity_id: 'event-01',
      details: 'Published event MECHAHACK 2026: 24-Hour Hardware & Robotics Hackathon.',
      created_at: '2026-10-15T10:00:00Z'
    }
  ]
};
