import React from "react";

const modalContent = [
  <>
    <p>This is slide 1's custom content, you shouldn't be able to see this.</p>
    <h3>1: Banana</h3>
  </>,
  <>

    <p>
      The history of the internet traces back to the Cold War era, when the need
      for robust, decentralized communication networks spurred innovation in
      digital networking. Initially developed as a military project in the late
      1960s, the internet evolved from ARPANET, a U.S. Department of Defense
      research initiative that connected computers at various universities and
      research institutions. Over time, the introduction of protocols like
      TCP/IP in the 1980s standardized communication between networks, laying
      the foundation for the modern internet.
    </p>
    <p>
      The 1990s marked a turning point with the creation of the World Wide Web
      by Tim Berners-Lee, which transformed the internet from a tool for
      researchers into a global medium for information, commerce, and
      communication. This era saw rapid commercial growth, the birth of search
      engines, and the first wave of digital startups. Since then, the internet
      has continued to expand, shaping nearly every aspect of modern life—from
      education and politics to entertainment and global economics.
    </p>
    <p>
      On this page is a simplified timeline showing the many collaborators and
      the many things that emerged as a result of the internet.
    </p>
    <h3>2: The History of the Web</h3>
  </>,
  <>

    <p>
      Today’s internet is a vast, global infrastructure made possible by an
      intricate web of physical and digital systems. Beneath the oceans,
      thousands of kilometers of submarine cables transmit data at lightning
      speed between continents. On land, massive data centers—often the size of
      warehouses—power the services we use every day, from streaming and cloud
      storage to social media and online banking.
    </p>
    <p>
      While the internet may feel wireless, it depends heavily on this hidden
      backbone of hardware, energy, and connectivity. On this page is a world
      map that visualizes both the major submarine cable routes and the
      locations of the largest data centers that keep the modern internet
      running.
    </p>
    <p>
      On this page is the submarine cable map and a peeringDB API access,
      showing all of the currently used modern data centers.
    </p>
    <h3>3: The Internet Today</h3>
  </>,
  <>

    <p>
      The network edge refers to the outermost parts of the internet where
      individual devices and local networks connect to the broader global
      system. This includes your home Wi-Fi, workplace networks, and cellular
      towers—each forming localized clusters of connectivity that rely on
      routers, switches, and access points to link with the core network
      infrastructure.
    </p>
    <p>
      Edge networks handle the initial and final steps of data transmission.
      Whether it’s a smartphone sending a message through a mobile tower, or a
      laptop accessing cloud storage via a home router, all data must pass
      through the edge before reaching its destination. These networks are
      optimized for quick access, low latency, and efficient bandwidth usage to
      support real-time applications and everyday connectivity.
    </p>
    <p>
      On this page is a visual breakdown of three major edge environments: the
      cellular network, the home network, and the enterprise network. Each
      connects to the internet through gateways that feed into the centralized
      network core, demonstrating how decentralized endpoints are united through
      a global infrastructure.
    </p>
    <h3>4: The Network Edge</h3>
  </>,
  <>

    <p>
      While the network edge is where users interact with the internet, the
      network core is where the real heavy lifting happens. Acting as the
      central highway system of the internet, the core consists of high-speed
      routers and fiber optic links that move vast amounts of data between
      different regions and service providers. It ensures that communication
      between any two points on the internet is fast, reliable, and efficient.
    </p>
    <p>
      The core doesn't directly connect to end-user devices; instead, it links
      together various edge networks—from homes and offices to mobile
      towers—through a dense mesh of interconnected paths. These routes are
      optimized for redundancy and performance, allowing data to take the most
      efficient path even during network congestion or outages. This layered
      separation between edge and core helps maintain the stability and
      scalability of the internet.
    </p>
    <p>
      On this page is a simplified diagram of the network core. Each node
      represents a powerful routing device, forming a tightly connected mesh
      responsible for directing global internet traffic. It shows how the
      network core ties together the many edge networks from the previous slide,
      enabling seamless communication across the world.
    </p>
    <h3>5: The Network Core</h3>
  </>,
  <>

    <p>
      Protocols are the foundational rules that govern how data is transmitted
      across the internet. They define the structure, timing, sequencing, and
      error handling of communications between devices. Without protocols,
      computers and networks wouldn’t understand each other, making reliable
      communication impossible across different systems and platforms.
    </p>
    <p>
      There are many types of protocols, each serving a specific role—from
      sending emails (SMTP) to loading web pages (HTTP) to maintaining stable,
      ordered data transmission (TCP). Protocols ensure that messages are not
      only delivered, but also arrive correctly, in the right order, and with
      appropriate responses based on the expectations set by both sender and
      receiver.
    </p>
    <p>
      On this page is a visualization of the Transmission Control Protocol
      (TCP), one of the most critical protocols for reliable data exchange. The
      left shows a detailed TCP header, which includes vital information like
      port numbers, sequence numbers, and checksums. On the right, a message
      exchange sequence illustrates how protocols coordinate responses and
      message ordering between devices.
    </p>
    <h3>6: Protocols</h3>
  </>,
  <>

    <p>
      When data is sent across the internet, it doesn't travel as a continuous
      stream but is broken into smaller units called packets. These packets are
      routed independently across a network of interconnected devices, finding
      the most efficient path to their destination. Along the way, routers make
      forwarding decisions based on addressing information within each packet.
    </p>
    <p>
      To prepare data for transmission, each layer of the networking model adds
      its own headers and sometimes footers in a process called encapsulation.
      This ensures that information needed for routing, delivery, and
      interpretation is properly included. Once the packet reaches its
      destination, the process is reversed—decapsulation strips away each
      layer’s information so the data can be used by the receiving application.
    </p>
    <p>
      On this page is a visualization comparing the TCP/IP and OSI networking
      models. It illustrates how data is encapsulated at the sender, routed
      across the internet, and then decapsulated at the receiver. The
      color-coded blocks show each layer’s contribution to the packet structure,
      giving insight into how the internet moves information efficiently and
      reliably.
    </p>
    <h3>7: Packet Routing, Encapsulation and Decapsulation</h3>
  </>,
  <>

    <p>
      When a computer receives a packet—such as an HTTP request for a webpage—it
      begins a complex sequence of steps to turn that data into something visual
      on screen. After the packet travels through the network and is handled by
      the operating system, the browser interprets the contents, which typically
      include HTML, CSS, and JavaScript files.
    </p>
    <p>
      This sequence of operations is called the Critical Rendering Path. It
      begins by parsing the HTML into the DOM (Document Object Model) and the
      CSS into the CSSOM (CSS Object Model). JavaScript can modify either of
      these structures dynamically. Once both the DOM and CSSOM are ready, the
      browser combines them into a Render Tree, calculates layout positions, and
      finally paints pixels to the screen—making the website visible and
      interactive to the user.
    </p>
    <p>
      On this page is a diagram showing the full Critical Rendering Path from
      network response to final screen output. It illustrates how a single HTTP
      packet transforms into visual content by passing through parsing,
      scripting, styling, layout, and painting stages, highlighting the
      invisible work your device does to bring the web to life.
    </p>
    <h3>8: Critical Rendering Path</h3>
  </>,
  <>

    <p>
      HTML (HyperText Markup Language) is the foundational language of the web,
      defining the structure and content of a webpage. When a browser receives
      an HTML document in response to an HTTP request, it begins parsing the
      file from top to bottom. As it reads each tag—like{" "}
      <code>&lt;head&gt;</code>, <code>&lt;body&gt;</code>, and{" "}
      <code>&lt;p&gt;</code>—it builds a structured representation of the page
      called the Document Object Model (DOM).
    </p>
    <p>
      The DOM is a tree-like data structure where each element, attribute, and
      piece of text becomes a node. This allows scripts, styles, and rendering
      engines to interact with the page’s content programmatically. This
      transformation from raw HTML into the DOM is one of the earliest and most
      essential steps in the critical rendering path, enabling layout, styling,
      and interactivity to follow.
    </p>
    <p>
      On this page is a side-by-side view of the original HTML source code and
      the resulting DOM structure. It demonstrates how each HTML tag becomes a
      DOM node with properties such as <code>nodeName</code>,{" "}
      <code>children</code>, and <code>innerText</code>, allowing the browser to
      understand and manipulate the content dynamically.
    </p>
    <h3>9: HTML</h3>
  </>,
  <>

    <p>
      Once an HTML file is received and parsed, the browser constructs a
      Document Object Model (DOM)—a structured, tree-like representation of the
      content. Each tag in the HTML becomes a node in this tree, with
      parent-child relationships that mirror the nesting of elements in the
      original source. This model allows browsers and scripts to dynamically
      interact with the document structure.
    </p>
    <p>
      The DOM is not just a passive representation—it is a live interface that
      can be queried, updated, and manipulated by JavaScript in real time. When
      you click a button, open a menu, or animate an element on a webpage, it's
      often the DOM being directly modified. Its dynamic nature is a core reason
      modern web experiences feel responsive and interactive.
    </p>
    <p>
      On this page is a visualization of the DOM as a tree graph, showing how
      each HTML element is organized hierarchically. This structure highlights
      how browsers understand relationships between tags, and how layout engines
      rely on the DOM to render and interact with content accurately.
    </p>
    <h3>10: DOM</h3>
  </>,
  <>

    <p>
      After constructing the DOM and CSSOM, the browser moves on to calculating
      the layout. This process determines the exact position and size of every
      element on the page based on the visual rules defined by CSS and the
      structure of the DOM. Layout is responsible for turning abstract nodes
      into a structured, spatial arrangement on the screen.
    </p>
    <p>
      The browser must account for numerous factors during layout: box
      dimensions, padding, margins, flex/grid positioning, and relationships
      between parent and child elements. This is especially important in
      responsive design, where screen size and orientation affect how content is
      arranged. Unlike the DOM or CSSOM, layout is computationally expensive and
      can affect performance if recalculated frequently.
    </p>
    <p>
      On this page is a wireframe-style visualization of a computed layout. It
      outlines each element’s final position in the viewport, including headers,
      main content, images, and tables. This representation demonstrates how the
      browser translates structured code into a visible spatial hierarchy on the
      screen.
    </p>
    <h3>11: Layout</h3>
  </>,
  <>
    <p>
      Painting is the final visual step in the critical rendering path. After
      layout calculations determine the size and position of each element, the
      browser begins translating these details into actual pixels on the screen.
      This process involves drawing text, images, backgrounds, borders, shadows,
      and every visual feature of a webpage.
    </p>
    <p>
      Each element is painted in a specific order, often layer by layer, to
      ensure proper stacking and visibility. Complex effects like transparency,
      blending, or hardware-accelerated animations may be sent to a separate
      composition stage. Optimizing paint performance is crucial—especially in
      dynamic or animated pages—since excessive repainting can cause visual lag
      and jank.
    </p>
    <p>
      On this page is a fully rendered view of the HTML content seen in earlier
      slides. It includes styled headings, a placeholder image, and two
      structured tables, all drawn to the screen as the result of the rendering
      pipeline’s final paint step. This is the moment where code becomes visible
      content.
    </p>
    <h3>12: Paint</h3>
  </>,
  <>
    <h3>13: Ending</h3>
    <p>Tha End</p>
  </>,
];

export default modalContent;
