import 'dart:io';
import 'dart:math';
import 'dart:ui';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';

import 'colors/PerfixiaColors.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    _DashboardHome(),
    _ProjectsPage(),
    _ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: PerfexiaColors.background,
      body: SafeArea(
        child: Stack(
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 350),
              child: _pages[_currentIndex],
            ),
            Positioned(
              top: 16,
              right: 16,
              child: _notificationButton(context, count: 3),
            ),
          ],
        ),
      ),

      /// -------- BOTTOM NAV --------
      bottomNavigationBar: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (index) => setState(() => _currentIndex = index),
            backgroundColor: Colors.black.withOpacity(0.55),
            selectedItemColor: PerfexiaColors.accent,
            unselectedItemColor: Colors.white60,
            showUnselectedLabels: true,
            type: BottomNavigationBarType.fixed,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.dashboard_outlined),
                label: "Dashboard",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.work_outline),
                label: "Projects",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_outline),
                label: "Profile",
              ),
            ],
          ),
        ),
      ),
    );
  }
}

Widget _notificationButton(BuildContext context, {required int count}) {
  return Stack(
    children: [
      ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const NotificationsScreen()),
              );
            },
            icon: const Icon(Icons.notifications_none, color: Colors.white),
          ),
        ),
      ),
      if (count > 0)
        Positioned(
          right: 6,
          top: 6,
          child: Container(
            padding: const EdgeInsets.all(4),
            decoration: const BoxDecoration(
              color: Colors.redAccent,
              shape: BoxShape.circle,
            ),
            child: Text(
              count.toString(),
              style: const TextStyle(fontSize: 10, color: Colors.white),
            ),
          ),
        ),
    ],
  );
}


class _DashboardHome extends StatelessWidget {
  const _DashboardHome();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Welcome back 👋",
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            "Let’s build something amazing today.",
            style: TextStyle(color: Colors.white70),
          ),
          const SizedBox(height: 32),

          /// Cards
          Expanded(
            child: Column(
              children: [
                Expanded(
                  child: GridView.count(
                    crossAxisCount:
                    MediaQuery.of(context).size.width > 800 ? 3 : 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    children: const [
                      _StatCard("Active Projects", "12", Icons.work_outline),
                      _StatCard("Clients", "28", Icons.people_outline),
                      _StatCard("Revenue", "₹1.2L", Icons.trending_up),
                      _StatCard("Tasks", "34", Icons.check_circle_outline),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
                _announcementCard(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

Widget _announcementCard() {
  return ClipRRect(
    borderRadius: BorderRadius.circular(20),
    child: BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.25)),
        ),
        child: const Row(
          children: [
            Icon(Icons.campaign_outlined, color: Colors.white70),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                "📢 New enterprise projects launching this week. Stay tuned!",
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;

  const _StatCard(this.title, this.value, this.icon);

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                PerfexiaColors.secondary.withOpacity(0.9),
                PerfexiaColors.primary.withOpacity(0.9),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: Colors.white70, size: 28),
              const Spacer(),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: const TextStyle(color: Colors.white70),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// ===================== PROJECTS PAGE =====================

class _ProjectsPage extends StatelessWidget {
  const _ProjectsPage();

  @override
  Widget build(BuildContext context) {
    final projects = <Project>[
      Project(
        id: "P001",
        name: "Perfexia CRM",
        shortDesc: "Enterprise client management platform",
        progress: 0.72,
        status: "In Progress",
        developerId: "D001",
        developerName: "Rohit",
      ),
      Project(
        id: "P002",
        name: "FinTech App",
        shortDesc: "Secure payments & analytics system",
        progress: 0.45,
        status: "Ongoing",
        developerId: "D002",
        developerName: "Ankit",
      ),
      Project(
        id: "P003",
        name: "Healthcare Dashboard",
        shortDesc: "Real-time analytics for hospitals",
        progress: 0.90,
        status: "Review",
        developerId: "D003",
        developerName: "Sneha",
      ),
    ];

    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _projectsHeader(),
          _searchBar(),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: projects.length,
              separatorBuilder: (_, __) => const SizedBox(height: 16),
              itemBuilder: (context, i) {
                final p = projects[i];
                return _ProjectCard(
                  name: p.name,
                  description: p.shortDesc,
                  progress: p.progress,
                  status: p.status,
                  developer: p.developerName,
                  onView: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ProjectDetailsScreen(project: p),
                      ),
                    );
                  },
                  onChat: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ChatScreen(
                          projectId: p.id,
                          developerId: p.developerId,
                          developerName: p.developerName,
                          developerAvatarUrl: p.developerAvatarUrl,
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

Widget _projectsHeader() {
  return const Padding(
    padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
    child: Text(
      "Projects",
      style: TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.bold,
        color: Colors.white,
      ),
    ),
  );
}

Widget _searchBar() {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 20),
    child: TextField(
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        hintText: "Search projects...",
        hintStyle: const TextStyle(color: Colors.white60),
        prefixIcon: const Icon(Icons.search, color: Colors.white70),
        filled: true,
        fillColor: Colors.white.withOpacity(0.12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
      ),
    ),
  );
}

class _ProjectCard extends StatelessWidget {
  final String name;
  final String description;
  final double progress;
  final String status;
  final String developer;

  final VoidCallback onView;
  final VoidCallback onChat;

  const _ProjectCard({
    required this.name,
    required this.description,
    required this.progress,
    required this.status,
    required this.developer,
    required this.onView,
    required this.onChat,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(22),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                PerfexiaColors.secondary.withOpacity(0.9),
                PerfexiaColors.primary.withOpacity(0.9),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(22),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              /// TOP ROW
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.work_outline, color: Colors.white70),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          description,
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),

                  /// RIGHT SIDE: Status + View
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      _statusBadge(status),
                      const SizedBox(height: 10),
                      OutlinedButton.icon(
                        onPressed: onView,
                        icon: const Icon(Icons.remove_red_eye, size: 16),
                        label: const Text("View"),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.white,
                          side: const BorderSide(color: Colors.white24),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(18),
                          ),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 10,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 16),

              /// PROGRESS
              Row(
                children: [
                  Expanded(
                    child: LinearProgressIndicator(
                      value: progress,
                      minHeight: 6,
                      backgroundColor: Colors.white24,
                      color: PerfexiaColors.accent,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    "${(progress * 100).round()}%",
                    style: const TextStyle(color: Colors.white),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              /// CHAT BUTTON
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton.icon(
                  onPressed: onChat,
                  icon: const Icon(Icons.message, size: 16),
                  label: Text(developer),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: PerfexiaColors.accent,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statusBadge(String status) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.14),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Colors.white24),
      ),
      child: Text(
        status,
        style: const TextStyle(color: Colors.white, fontSize: 12),
      ),
    );
  }
}

/// ===================== PROFILE PAGE (YOUR CODE KEPT) =====================

class _ProfilePage extends StatefulWidget {
  const _ProfilePage({super.key});

  @override
  State<_ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<_ProfilePage> {
  bool showBack = false;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isMobile = constraints.maxWidth < 720;
        if (isMobile) return _mobileFlipCard();
        return _webDualCard();
      },
    );
  }

  Widget _mobileFlipCard() {
    return Center(
      child: GestureDetector(
        onTap: () => setState(() => showBack = !showBack),
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 700),
          switchInCurve: Curves.easeInOut,
          switchOutCurve: Curves.easeInOut,
          transitionBuilder: (child, animation) {
            final rotate = Tween(begin: pi, end: 0.0).animate(animation);
            return AnimatedBuilder(
              animation: rotate,
              child: child,
              builder: (context, child) {
                final isUnder = (ValueKey(showBack) != child!.key);
                final tilt = isUnder ? min(rotate.value, pi / 2) : rotate.value;
                return Transform(
                  transform: Matrix4.rotationY(tilt),
                  alignment: Alignment.center,
                  child: child,
                );
              },
            );
          },
          child: showBack
              ? _backCard(key: const ValueKey(true))
              : _frontCard(key: const ValueKey(false)),
        ),
      ),
    );
  }

  Widget _webDualCard() {
    return Center(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _frontCard(),
          const SizedBox(width: 32),
          _backCard(),
        ],
      ),
    );
  }

  Widget _frontCard({Key? key}) {
    return Container(
      key: key,
      width: 320,
      padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 22),
      decoration: _cardDecoration(),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            "Perfexia",
            style: TextStyle(
              fontSize: 34,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            "Where perfection Meets Excellence",
            style: TextStyle(color: Colors.white70),
          ),
          const SizedBox(height: 28),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 4),
            ),
            child: const CircleAvatar(
              radius: 42,
              backgroundColor: Color(0xFFEDE7F6),
              child: Icon(Icons.person, size: 42, color: Color(0xFF7E57C2)),
            ),
          ),
          const SizedBox(height: 18),
          const Text(
            "Your Name",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 4),
          const Text("Your Designation",
              style: TextStyle(color: Colors.black87)),
          const SizedBox(height: 18),
          const Text(
            "E002",
            style: TextStyle(
              fontSize: 38,
              fontWeight: FontWeight.bold,
              color: Colors.white38,
            ),
          ),
          const SizedBox(height: 28),
          const Text(
            "Slide To Back →",
            style: TextStyle(color: Colors.black),
          ),
        ],
      ),
    );
  }

  Widget _backCard({Key? key}) {
    return Container(
      key: key,
      width: 320,
      height: 500,
      padding: const EdgeInsets.all(24),
      decoration: _cardDecoration(),
      child: Column(
        children: [
          _infoRow("Email", "youremail@perfexia.com"),
          const SizedBox(height: 12),
          _infoRow("Contact", "+91 9876543210"),
          const SizedBox(height: 32),
          Row(
            children: [
              _projectStat("Completed\nProjects", "18"),
              Container(width: 1, height: 60, color: Colors.white54),
              _projectStat("Ongoing\nProjects", "4"),
            ],
          ),
          const SizedBox(height: 28),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white),
              color: Colors.white.withOpacity(0.25),
            ),
            child: const Text(
              "Great products are built when vision meets flawless execution",
              style: TextStyle(color: Colors.white),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  BoxDecoration _cardDecoration() {
    return BoxDecoration(
      borderRadius: BorderRadius.circular(28),
      gradient: const LinearGradient(
        colors: [Color(0xFF4A148C), Color(0xFF8E5CFF)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Row(
      children: [
        SizedBox(
          width: 80,
          child: Text(
            "$label :",
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        Expanded(
          child: Text(value, style: const TextStyle(color: Colors.white)),
        ),
      ],
    );
  }

  Widget _projectStat(String title, String value) {
    return Expanded(
      child: Column(
        children: [
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: Colors.white38,
            ),
          ),
        ],
      ),
    );
  }
}

/// ===================== MODELS + PLACEHOLDERS =====================

class Project {
  final String id;
  final String name;
  final String shortDesc;
  final double progress;
  final String status;
  final String developerId;
  final String developerName;
  final String? developerAvatarUrl;

  // optional details
  final String? quote;
  final String? budgetText;
  final List<ProjectDoc> documents;

  Project({
    required this.id,
    required this.name,
    required this.shortDesc,
    required this.progress,
    required this.status,
    required this.developerId,
    required this.developerName,
    this.developerAvatarUrl,
    this.quote,
    this.budgetText,
    this.documents = const [],
  });
}

class ProjectDoc {
  final String title;
  final String type;
  final String? url;
  const ProjectDoc({required this.title, required this.type, this.url});
}

class ProjectDetailsScreen extends StatelessWidget {
  final Project project;
  const ProjectDetailsScreen({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Project Details")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _tile("Topic", project.name),
          _tile("Description", project.shortDesc),
          _tile("Quote", project.quote ?? "—"),
          _tile("Budget", project.budgetText ?? "—"),
          const SizedBox(height: 12),
          const Text("Documents",
              style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          if (project.documents.isEmpty)
            const Text("No documents added yet.")
          else
            ...project.documents.map(
                  (d) => ListTile(
                leading: const Icon(Icons.insert_drive_file_outlined),
                title: Text(d.title),
                subtitle: Text(d.type),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              ),
            ),
        ],
      ),
    );
  }

  Widget _tile(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          color: Colors.black.withOpacity(0.05),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label,
                style:
                const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
            const SizedBox(height: 6),
            Text(value, style: const TextStyle(fontSize: 14)),
          ],
        ),
      ),
    );
  }
}

class ChatScreen extends StatefulWidget {
  final String projectId;
  final String developerId;
  final String developerName;
  final String? developerAvatarUrl;

  const ChatScreen({
    super.key,
    required this.projectId,
    required this.developerId,
    required this.developerName,
    this.developerAvatarUrl,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _picker = ImagePicker();
  final _controller = TextEditingController();
  final _scrollController = ScrollController();

  // Demo messages list (replace with API/WebSocket stream later)
  final List<_ChatMessage> _messages = [
    _ChatMessage.text(
      id: "1",
      isMe: false,
      text: "Hi! I’m assigned to this project. Share requirements here.",
      time: DateTime.now().subtract(const Duration(minutes: 14)),
    ),
    _ChatMessage.text(
      id: "2",
      isMe: true,
      text: "Perfect. I’ll send the scope doc and UI references.",
      time: DateTime.now().subtract(const Duration(minutes: 12)),
    ),
  ];

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    if (!_scrollController.hasClients) return;
    _scrollController.animateTo(
      0, // because ListView is reverse:true
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeOut,
    );
  }

  void _sendText() {
    final txt = _controller.text.trim();
    if (txt.isEmpty) return;

    setState(() {
      _messages.insert(
        0,
        _ChatMessage.text(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          text: txt,
          time: DateTime.now(),
        ),
      );
    });

    _controller.clear();
    _scrollToBottom();

    // TODO: send to backend
  }

  Future<void> _pickImage({ImageSource source = ImageSource.gallery}) async {
    final x = await _picker.pickImage(source: source, imageQuality: 80);
    if (x == null) return;

    setState(() {
      _messages.insert(
        0,
        _ChatMessage.media(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          path: x.path,
          mediaType: _MediaType.image,
          time: DateTime.now(),
        ),
      );
    });

    _scrollToBottom();

    // TODO: upload file then send message with URL
  }

  Future<void> _pickVideo({ImageSource source = ImageSource.gallery}) async {
    final x = await _picker.pickVideo(source: source);
    if (x == null) return;

    setState(() {
      _messages.insert(
        0,
        _ChatMessage.media(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          path: x.path,
          mediaType: _MediaType.video,
          time: DateTime.now(),
        ),
      );
    });

    _scrollToBottom();

    // TODO: upload file then send message with URL
  }

  void _openAttachmentSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) {
        final isWeb = kIsWeb;

        return Padding(
          padding: const EdgeInsets.all(12),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(18),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.60),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: Colors.white.withOpacity(0.12)),
                ),
                padding: const EdgeInsets.all(12),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (!isWeb) ...[
                      _sheetItem(
                        icon: Icons.image_outlined,
                        title: "Select from Gallery",
                        onTap: () {
                          Navigator.pop(context);
                          _pickImageFromGallery();
                        },
                      ),
                      _sheetItem(
                        icon: Icons.photo_camera_outlined,
                        title: "Take a Picture (Back Camera)",
                        onTap: () {
                          Navigator.pop(context);
                          _takePhotoBackCameraOnly();
                        },
                      ),
                      _sheetItem(
                        icon: Icons.videocam_outlined,
                        title: "Select Video (Gallery)",
                        onTap: () {
                          Navigator.pop(context);
                          _pickVideoFromGallery();
                        },
                      ),
                    ],

                    // Works on mobile + web/desktop
                    _sheetItem(
                      icon: Icons.upload_file_outlined,
                      title: "Upload Document (PDF/DOC/ZIP...)",
                      onTap: () {
                        Navigator.pop(context);
                        _pickDocument();
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Future<void> _pickImageFromGallery() async {
    final x = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 80,
    );
    if (x == null) return;

    setState(() {
      _messages.insert(
        0,
        _ChatMessage.media(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          path: x.path,
          mediaType: _MediaType.image,
          time: DateTime.now(),
        ),
      );
    });

    _scrollToBottom();
  }

  Future<void> _takePhotoBackCameraOnly() async {
    final x = await _picker.pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.rear, // back only
      imageQuality: 80,
    );
    if (x == null) return;

    setState(() {
      _messages.insert(
        0,
        _ChatMessage.media(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          path: x.path,
          mediaType: _MediaType.image,
          time: DateTime.now(),
        ),
      );
    });

    _scrollToBottom();
  }

  Future<void> _pickVideoFromGallery() async {
    final x = await _picker.pickVideo(source: ImageSource.gallery);
    if (x == null) return;

    setState(() {
      _messages.insert(
        0,
        _ChatMessage.media(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          path: x.path,
          mediaType: _MediaType.video,
          time: DateTime.now(),
        ),
      );
    });

    _scrollToBottom();
  }

  Future<void> _pickDocument() async {
    final result = await FilePicker.platform.pickFiles(
      allowMultiple: false,
      type: FileType.custom,
      allowedExtensions: [
        "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
        "txt", "zip", "rar", "png", "jpg", "jpeg"
      ],
      withData: kIsWeb, // for web you may need bytes
    );

    if (result == null || result.files.isEmpty) return;

    final file = result.files.first;
    final path = file.path; // available on mobile/desktop
    final name = file.name;

    // Show document as a chat item
    setState(() {
      _messages.insert(
        0,
        _ChatMessage.document(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          fileName: name,
          localPath: path,
          time: DateTime.now(),
        ),
      );
    });

    _scrollToBottom();

    // TODO: Upload to backend:
    // - if kIsWeb: use file.bytes
    // - else: use File(path!)
  }

  Widget _sheetItem({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Icon(icon, color: Colors.white),
      title: Text(title, style: const TextStyle(color: Colors.white)),
      trailing: const Icon(Icons.chevron_right, color: Colors.white60),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: PerfexiaColors.background,
      appBar: AppBar(
        backgroundColor: Colors.black.withOpacity(0.35),
        elevation: 0,
        titleSpacing: 0,
        title: Row(
          children: [
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 18,
              backgroundColor: Colors.white.withOpacity(0.12),
              child: Text(
                widget.developerName.isNotEmpty
                    ? widget.developerName[0].toUpperCase()
                    : "D",
                style: const TextStyle(color: Colors.white),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.developerName,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    "Project • ${widget.projectId}",
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white.withOpacity(0.65),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),

      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              reverse: true,
              padding: const EdgeInsets.fromLTRB(14, 14, 14, 10),
              itemCount: _messages.length,
              itemBuilder: (_, i) => _ChatBubble(msg: _messages[i]),
            ),
          ),

          /// COMPOSER
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.10),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: Colors.white.withOpacity(0.12)),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    child: Row(
                      children: [
                        IconButton(
                          onPressed: _openAttachmentSheet,
                          icon: const Icon(Icons.add_circle_outline, color: Colors.white),
                        ),
                        Expanded(
                          child: TextField(
                            controller: _controller,
                            style: const TextStyle(color: Colors.white),
                            minLines: 1,
                            maxLines: 5,
                            decoration: InputDecoration(
                              hintText: "Message ${widget.developerName}…",
                              hintStyle: TextStyle(color: Colors.white.withOpacity(0.6)),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        const SizedBox(width: 6),
                        GestureDetector(
                          onTap: _sendText,
                          child: Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: PerfexiaColors.accent,
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Icon(Icons.send, color: Colors.black, size: 18),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// ===================== CHAT UI PARTS =====================

enum _MediaType { image, video }

class _ChatMessage {
  final String id;
  final bool isMe;
  final DateTime time;

  final String? text;

  // media
  final String? path;
  final _MediaType? mediaType;

  // document
  final String? fileName;
  final String? localPath;

  const _ChatMessage._({
    required this.id,
    required this.isMe,
    required this.time,
    this.text,
    this.path,
    this.mediaType,
    this.fileName,
    this.localPath,
  });

  factory _ChatMessage.text({
    required String id,
    required bool isMe,
    required String text,
    required DateTime time,
  }) {
    return _ChatMessage._(id: id, isMe: isMe, text: text, time: time);
  }

  factory _ChatMessage.media({
    required String id,
    required bool isMe,
    required String path,
    required _MediaType mediaType,
    required DateTime time,
  }) {
    return _ChatMessage._(
      id: id,
      isMe: isMe,
      path: path,
      mediaType: mediaType,
      time: time,
    );
  }

  factory _ChatMessage.document({
    required String id,
    required bool isMe,
    required String fileName,
    required String? localPath,
    required DateTime time,
  }) {
    return _ChatMessage._(
      id: id,
      isMe: isMe,
      fileName: fileName,
      localPath: localPath,
      time: time,
    );
  }

  bool get isText => text != null;
  bool get isMedia => path != null && mediaType != null;
  bool get isDoc => fileName != null;
}

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final notifications = <AppNotification>[
      AppNotification(
        title: "New Project Assigned",
        message: "You have been assigned to Perfexia CRM project.",
        sentBy: "Admin",
        time: DateTime.now().subtract(const Duration(minutes: 25)),
      ),
      AppNotification(
        title: "Client Message",
        message: "Client shared new requirements document. Please review.",
        sentBy: "Rohit",
        time: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      AppNotification(
        title: "Milestone Update",
        message: "Healthcare Dashboard moved to Review stage.",
        sentBy: "System",
        time: DateTime.now().subtract(const Duration(days: 1, hours: 3)),
      ),
    ];

    return Scaffold(
      backgroundColor: PerfexiaColors.background,
      appBar: AppBar(
        title: const Text("Notifications"),
        backgroundColor: Colors.black.withOpacity(0.35),
        elevation: 0,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: notifications.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, i) => _NotificationTile(n: notifications[i]),
      ),
    );
  }
}

class AppNotification {
  final String title;
  final String message;
  final String sentBy;
  final DateTime time;

  AppNotification({
    required this.title,
    required this.message,
    required this.sentBy,
    required this.time,
  });
}

class _NotificationTile extends StatelessWidget {
  final AppNotification n;
  const _NotificationTile({required this.n});

  String _two(int v) => v.toString().padLeft(2, "0");

  @override
  Widget build(BuildContext context) {
    final dt = n.time;
    final dateText = "${_two(dt.day)}/${_two(dt.month)}/${dt.year}";
    final timeText = "${_two(dt.hour)}:${_two(dt.minute)}";

    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.10),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: Colors.white.withOpacity(0.12)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              /// Title + DateTime (top right)
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      n.title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                        fontSize: 15,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(dateText,
                          style: const TextStyle(
                              color: Colors.white70, fontSize: 11)),
                      Text(timeText,
                          style: const TextStyle(
                              color: Colors.white70, fontSize: 11)),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 10),

              /// Message
              Text(
                n.message,
                style: const TextStyle(color: Colors.white70, fontSize: 13),
              ),

              const SizedBox(height: 12),

              /// Sent by (bottom right)
              Align(
                alignment: Alignment.centerRight,
                child: Text(
                  "Sent by • ${n.sentBy}",
                  style: const TextStyle(
                    color: Colors.white60,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}



class _ChatBubble extends StatelessWidget {
  final _ChatMessage msg;

  const _ChatBubble({required this.msg});

  @override
  Widget build(BuildContext context) {
    final align = msg.isMe ? Alignment.centerRight : Alignment.centerLeft;

    final bubbleColor = msg.isMe
        ? PerfexiaColors.accent.withOpacity(0.95)
        : Colors.white.withOpacity(0.12);

    final textColor = msg.isMe ? Colors.black : Colors.white;

    final radius = BorderRadius.only(
      topLeft: const Radius.circular(16),
      topRight: const Radius.circular(16),
      bottomLeft: Radius.circular(msg.isMe ? 16 : 4),
      bottomRight: Radius.circular(msg.isMe ? 4 : 16),
    );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Align(
        alignment: align,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 340),
          child: ClipRRect(
            borderRadius: radius,
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
              child: Container(
                decoration: BoxDecoration(
                  color: bubbleColor,
                  borderRadius: radius,
                  border: Border.all(
                    color: msg.isMe ? Colors.black.withOpacity(0.08) : Colors
                        .white.withOpacity(0.12),
                  ),
                ),
                padding: msg.isText
                    ? const EdgeInsets.all(12)
                    : const EdgeInsets.all(6),
                child: _content(textColor),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _content(Color textColor) {
    if (msg.isText) {
      return Text(
        msg.text!,
        style: TextStyle(color: textColor, fontSize: 14, height: 1.35),
      );
    }

    if (msg.isDoc) {
      return Container(
        width: 260,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.10),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withOpacity(0.12)),
        ),
        child: Row(
          children: [
            const Icon(Icons.insert_drive_file_outlined, color: Colors.white),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                msg.fileName!,
                style: const TextStyle(color: Colors.white),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 10),
            const Icon(Icons.download_done, color: Colors.white70, size: 18),
          ],
        ),
      );
    }

    // MEDIA
    if (msg.mediaType == _MediaType.image) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Image.file(
          File(msg.path!),
          width: 240,
          height: 180,
          fit: BoxFit.cover,
        ),
      );
    }

    // VIDEO
    return Container(
      width: 240,
      height: 120,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.12)),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.play_circle_outline, color: Colors.white),
          SizedBox(width: 10),
          Text("Video attached", style: TextStyle(color: Colors.white)),
        ],
      ),
    );
  }
}

