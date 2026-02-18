import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';

import 'colors/PerfixiaColors.dart';

class DeveloperScreen extends StatefulWidget {
  const DeveloperScreen({super.key});

  @override
  State<DeveloperScreen> createState() => _DeveloperScreenState();
}

class _DeveloperScreenState extends State<DeveloperScreen> {
  int _currentIndex = 0;

  // ✅ ONLY assigned projects (demo data)
  final List<Project> assignedProjects = [
    Project(
      id: "P001",
      name: "Perfexia CRM",
      shortDesc: "Enterprise client management platform",
      progress: 0.72,
      status: "In Progress",
      clientName: "Perfexia Admin",
    ),
    Project(
      id: "P002",
      name: "FinTech App",
      shortDesc: "Secure payments & analytics system",
      progress: 0.45,
      status: "Ongoing",
      clientName: "Rupenet Team",
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final pages = [
      _DevHomePage(projects: assignedProjects),
      _DevProjectsPage(projects: assignedProjects),
      _DevInboxPage(projects: assignedProjects),
    ];

    return Scaffold(
      backgroundColor: PerfexiaColors.background,
      body: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 300),
          child: pages[_currentIndex],
        ),
      ),
      bottomNavigationBar: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (i) => setState(() => _currentIndex = i),
            backgroundColor: Colors.black.withOpacity(0.55),
            selectedItemColor: PerfexiaColors.accent,
            unselectedItemColor: Colors.white60,
            showUnselectedLabels: true,
            type: BottomNavigationBarType.fixed,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.dashboard_outlined),
                label: "Home",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.work_outline),
                label: "Projects",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.forum_outlined),
                label: "Chat",
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// ===================== DEV HOME =====================

class _DevHomePage extends StatelessWidget {
  final List<Project> projects;
  const _DevHomePage({required this.projects});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Developer Dashboard",
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            "Assigned projects (${projects.length})",
            style: const TextStyle(color: Colors.white70),
          ),
          const SizedBox(height: 18),

          Expanded(
            child: ListView.separated(
              itemCount: projects.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (context, i) {
                final p = projects[i];
                return _AssignedProjectCard(
                  project: p,
                  onOpenChat: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DevReplyChatScreen(project: p),
                      ),
                    );
                  },
                  onView: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DevProjectDetailsScreen(project: p),
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

/// ===================== DEV PROJECTS =====================

class _DevProjectsPage extends StatefulWidget {
  final List<Project> projects;
  const _DevProjectsPage({required this.projects});

  @override
  State<_DevProjectsPage> createState() => _DevProjectsPageState();
}

class _DevProjectsPageState extends State<_DevProjectsPage> {
  String q = "";

  @override
  Widget build(BuildContext context) {
    final filtered = widget.projects.where((p) {
      final s = (p.name + p.shortDesc + p.status).toLowerCase();
      return s.contains(q.toLowerCase());
    }).toList();

    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
            child: Text(
              "Assigned Projects",
              style: TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: TextField(
              style: const TextStyle(color: Colors.white),
              onChanged: (v) => setState(() => q = v),
              decoration: InputDecoration(
                hintText: "Search assigned projects...",
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
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: filtered.length,
              separatorBuilder: (_, __) => const SizedBox(height: 14),
              itemBuilder: (context, i) {
                final p = filtered[i];
                return _AssignedProjectCard(
                  project: p,
                  onOpenChat: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DevReplyChatScreen(project: p),
                      ),
                    );
                  },
                  onView: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DevProjectDetailsScreen(project: p),
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

/// ===================== DEV INBOX (CHAT LIST) =====================

class _DevInboxPage extends StatelessWidget {
  final List<Project> projects;
  const _DevInboxPage({required this.projects});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(18, 18, 18, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Inbox",
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            "Reply to project chats",
            style: TextStyle(color: Colors.white70),
          ),
          const SizedBox(height: 16),

          Expanded(
            child: ListView.separated(
              itemCount: projects.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, i) {
                final p = projects[i];
                return _InboxTile(
                  project: p,
                  lastMessage: "Tap to reply to client updates…",
                  timeText: "Today",
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => DevReplyChatScreen(project: p),
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

class _InboxTile extends StatelessWidget {
  final Project project;
  final String lastMessage;
  final String timeText;
  final VoidCallback onTap;

  const _InboxTile({
    required this.project,
    required this.lastMessage,
    required this.timeText,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(18),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.10),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: Colors.white.withOpacity(0.12)),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.white.withOpacity(0.12),
                  child: Text(
                    project.name.isNotEmpty ? project.name[0].toUpperCase() : "P",
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        project.name,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        lastMessage,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(timeText, style: const TextStyle(color: Colors.white60, fontSize: 11)),
                    const SizedBox(height: 8),
                    const Icon(Icons.chevron_right, color: Colors.white60),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// ===================== ASSIGNED PROJECT CARD =====================

class _AssignedProjectCard extends StatelessWidget {
  final Project project;
  final VoidCallback onView;
  final VoidCallback onOpenChat;

  const _AssignedProjectCard({
    required this.project,
    required this.onView,
    required this.onOpenChat,
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
                          project.name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          project.shortDesc,
                          style: const TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "Client: ${project.clientName}",
                          style: const TextStyle(color: Colors.white60, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      _statusBadge(project.status),
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
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: LinearProgressIndicator(
                      value: project.progress,
                      minHeight: 6,
                      backgroundColor: Colors.white24,
                      color: PerfexiaColors.accent,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    "${(project.progress * 100).round()}%",
                    style: const TextStyle(color: Colors.white),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton.icon(
                  onPressed: onOpenChat,
                  icon: const Icon(Icons.reply, size: 16),
                  label: const Text("Reply"),
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
      child: Text(status, style: const TextStyle(color: Colors.white, fontSize: 12)),
    );
  }
}

/// ===================== DETAILS =====================

class DevProjectDetailsScreen extends StatelessWidget {
  final Project project;
  const DevProjectDetailsScreen({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: PerfexiaColors.background,
      appBar: AppBar(
        title: const Text("Project Details"),
        backgroundColor: Colors.black.withOpacity(0.35),
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _tile("Topic", project.name),
          _tile("Description", project.shortDesc),
          _tile("Status", project.status),
          _tile("Client", project.clientName),
          _tile("Progress", "${(project.progress * 100).round()}%"),
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
          color: Colors.white.withOpacity(0.08),
          border: Border.all(color: Colors.white.withOpacity(0.12)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
            const SizedBox(height: 6),
            Text(value, style: const TextStyle(color: Colors.white, fontSize: 14)),
          ],
        ),
      ),
    );
  }
}

/// ===================== REPLY CHAT (DEVELOPER) =====================
/// Reply screen means: developer is replying, so default send bubble is "me".
/// Works with image/video/doc attachments.
/// On Web: hides camera/gallery, allows document upload.

class DevReplyChatScreen extends StatefulWidget {
  final Project project;
  const DevReplyChatScreen({super.key, required this.project});

  @override
  State<DevReplyChatScreen> createState() => _DevReplyChatScreenState();
}

class _DevReplyChatScreenState extends State<DevReplyChatScreen> {
  final _picker = ImagePicker();
  final _controller = TextEditingController();
  final _scrollController = ScrollController();

  final List<_ChatMsg> _msgs = [
    _ChatMsg.text(
      id: "1",
      isMe: false,
      text: "Client: Please confirm the delivery date for milestone 1.",
      time: DateTime.now().subtract(const Duration(minutes: 20)),
    ),
    _ChatMsg.text(
      id: "2",
      isMe: true,
      text: "Sure. I’ll share the updated timeline today.",
      time: DateTime.now().subtract(const Duration(minutes: 18)),
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
      0,
      duration: const Duration(milliseconds: 240),
      curve: Curves.easeOut,
    );
  }

  void _sendText() {
    final t = _controller.text.trim();
    if (t.isEmpty) return;

    setState(() {
      _msgs.insert(
        0,
        _ChatMsg.text(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          text: t,
          time: DateTime.now(),
        ),
      );
    });

    _controller.clear();
    _scrollToBottom();
  }

  Future<void> _pickDoc() async {
    final res = await FilePicker.platform.pickFiles(
      allowMultiple: false,
      type: FileType.custom,
      allowedExtensions: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip", "rar", "txt"],
      withData: kIsWeb,
    );
    if (res == null || res.files.isEmpty) return;

    final f = res.files.first;

    setState(() {
      _msgs.insert(
        0,
        _ChatMsg.doc(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          fileName: f.name,
          localPath: f.path,
          time: DateTime.now(),
        ),
      );
    });

    _scrollToBottom();
  }

  Future<void> _pickImageGallery() async {
    final x = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (x == null) return;
    setState(() {
      _msgs.insert(
        0,
        _ChatMsg.media(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          path: x.path,
          media: _MediaType.image,
          time: DateTime.now(),
        ),
      );
    });
    _scrollToBottom();
  }

  Future<void> _takeBackCamera() async {
    final x = await _picker.pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.rear,
      imageQuality: 80,
    );
    if (x == null) return;
    setState(() {
      _msgs.insert(
        0,
        _ChatMsg.media(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          path: x.path,
          media: _MediaType.image,
          time: DateTime.now(),
        ),
      );
    });
    _scrollToBottom();
  }

  Future<void> _pickVideo() async {
    final x = await _picker.pickVideo(source: ImageSource.gallery);
    if (x == null) return;
    setState(() {
      _msgs.insert(
        0,
        _ChatMsg.media(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          isMe: true,
          path: x.path,
          media: _MediaType.video,
          time: DateTime.now(),
        ),
      );
    });
    _scrollToBottom();
  }

  void _openAttachSheet() {
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
                          _pickImageGallery();
                        },
                      ),
                      _sheetItem(
                        icon: Icons.photo_camera_outlined,
                        title: "Take a Picture (Back Camera)",
                        onTap: () {
                          Navigator.pop(context);
                          _takeBackCamera();
                        },
                      ),
                      _sheetItem(
                        icon: Icons.videocam_outlined,
                        title: "Select Video (Gallery)",
                        onTap: () {
                          Navigator.pop(context);
                          _pickVideo();
                        },
                      ),
                    ],
                    _sheetItem(
                      icon: Icons.upload_file_outlined,
                      title: "Upload Document",
                      onTap: () {
                        Navigator.pop(context);
                        _pickDoc();
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
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.project.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800)),
            Text("Reply to: ${widget.project.clientName}",
                style: TextStyle(color: Colors.white.withOpacity(0.65), fontSize: 12)),
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
              itemCount: _msgs.length,
              itemBuilder: (_, i) => _DevChatBubble(msg: _msgs[i]),
            ),
          ),
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
                          onPressed: _openAttachSheet,
                          icon: const Icon(Icons.add_circle_outline, color: Colors.white),
                        ),
                        Expanded(
                          child: TextField(
                            controller: _controller,
                            style: const TextStyle(color: Colors.white),
                            minLines: 1,
                            maxLines: 5,
                            decoration: InputDecoration(
                              hintText: "Reply to client…",
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

/// ===================== CHAT MODELS =====================

enum _MediaType { image, video }

class _ChatMsg {
  final String id;
  final bool isMe;
  final DateTime time;

  final String? text;

  final String? path;
  final _MediaType? media;

  final String? fileName;
  final String? localPath;

  const _ChatMsg._({
    required this.id,
    required this.isMe,
    required this.time,
    this.text,
    this.path,
    this.media,
    this.fileName,
    this.localPath,
  });

  factory _ChatMsg.text({
    required String id,
    required bool isMe,
    required String text,
    required DateTime time,
  }) =>
      _ChatMsg._(id: id, isMe: isMe, text: text, time: time);

  factory _ChatMsg.media({
    required String id,
    required bool isMe,
    required String path,
    required _MediaType media,
    required DateTime time,
  }) =>
      _ChatMsg._(id: id, isMe: isMe, path: path, media: media, time: time);

  factory _ChatMsg.doc({
    required String id,
    required bool isMe,
    required String fileName,
    required String? localPath,
    required DateTime time,
  }) =>
      _ChatMsg._(id: id, isMe: isMe, fileName: fileName, localPath: localPath, time: time);

  bool get isText => text != null;
  bool get isMedia => path != null && media != null;
  bool get isDoc => fileName != null;
}

class _DevChatBubble extends StatelessWidget {
  final _ChatMsg msg;
  const _DevChatBubble({required this.msg});

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
          constraints: const BoxConstraints(maxWidth: 360),
          child: ClipRRect(
            borderRadius: radius,
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
              child: Container(
                decoration: BoxDecoration(
                  color: bubbleColor,
                  borderRadius: radius,
                  border: Border.all(
                    color: msg.isMe ? Colors.black.withOpacity(0.08) : Colors.white.withOpacity(0.12),
                  ),
                ),
                padding: msg.isText ? const EdgeInsets.all(12) : const EdgeInsets.all(6),
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
            const Icon(Icons.check_circle_outline, color: Colors.white70, size: 18),
          ],
        ),
      );
    }

    if (msg.media == _MediaType.image) {
      // On web, File(...) may not work. For now: show only on non-web.
      if (kIsWeb) {
        return Container(
          width: 240,
          height: 180,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.12),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white.withOpacity(0.12)),
          ),
          child: const Text("Image attached", style: TextStyle(color: Colors.white)),
        );
      }

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

/// ===================== MODELS =====================

class Project {
  final String id;
  final String name;
  final String shortDesc;
  final double progress;
  final String status;
  final String clientName;

  Project({
    required this.id,
    required this.name,
    required this.shortDesc,
    required this.progress,
    required this.status,
    required this.clientName,
  });
}
