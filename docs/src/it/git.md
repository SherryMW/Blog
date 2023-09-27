---
date: 2022-05-22
category: IT
---

# Git

Git 就像是程序员的时间机器，可以让你轻松穿越代码的时光

<!-- more -->

官网：[https://git-scm.com/book/zh/v2](https://git-scm.com/book/zh/v2)

## Git 简介

Git 是一个分布式版本控制系统，用于管理和跟踪软件开发项目的代码变更。以下是 Git 的主要功能和用途：

1. 版本控制：Git 可以跟踪文件的修改、添加和删除等操作，并记录每个修改的历史。这使得开发人员可以轻松地回溯和恢复到任意时间点的代码状态

2. 多人协作：Git 允许多个开发人员同时在同一个项目上工作，并能够合并（merge）彼此的代码变更。它提供了分支（branch）的概念，允许开发人员在独立的分支上进行开发，并在完成后将其合并到主分支上

3. 分布式开发：Git 是一个分布式版本控制系统，每个开发人员都可以在自己的本地仓库中进行完整的版本控制操作。这意味着即使没有网络连接，开发人员仍然可以进行提交、回滚和浏览历史记录等操作

4. 提交和回滚：开发人员可以使用 Git 提交（commit）命令来保存代码的状态，并添加相关的注释信息。此外，Git 还支持回滚（revert）操作，可以撤销先前的提交，回到之前的代码状态

5. 分支管理：Git 提供了强大的分支管理功能，开发人员可以创建新的分支来独立开发某个功能或修复某个 bug，而不会影响主分支上的代码。分支可以合并回主分支，也可以删除不再需要的分支

6. 远程仓库协作：Git 可以与远程仓库（如 GitHub、GitLab、Bitbucket 等）进行交互，开发人员可以将本地的代码推送（push）到远程仓库，或者从远程仓库拉取（pull）最新的代码

7. 工作流支持：Git 支持多种工作流程和开发模型，如集中式工作流、分叉工作流、拉取请求（Pull Request）等，可以根据团队和项目的需求选择适合的工作流程

## 起步

### 关于版本控制

如果你是位图形或网页设计师，可能会需要保存某一幅图片或页面布局文件的所有修订版本（这或许是你非常渴望拥有的功能），采用版本控制系统（VCS）是个明智的选择。有了它你就可以将选定的文件回溯到之前的状态，甚至将整个项目都回退到过去某个时间点的状态，你可以比较文件的变化细节，查出最后是谁修改了哪个地方，从而找出导致怪异问题出现的原因，又是谁在何时报告了某个功能缺陷等等。使用版本控制系统通常还意味着，就算你乱来一气把整个项目中的文件改的改删的删，你也照样可以轻松恢复到原先的样子。但额外增加的工作量却微乎其微

#### 本地版本控制系统

许多人习惯用复制整个项目目录的方式来保存不同的版本，或许还会改名加上备份时间以示区别。这么做唯一的好处就是简单，但是特别容易犯错。有时候会混淆所在的工作目录，一不小心会写错文件或者覆盖意想外的文件

为了解决这个问题，人们很久以前就开发了许多种本地版本控制系统，大多都是采用某种简单的数据库来记录文件的历次更新差异

![本地版本控制](https://git-scm.com/book/en/v2/images/local.png)

其中最流行的一种叫做 RCS，现今许多计算机系统上都还看得到它的踪影。RCS 的工作原理是在硬盘上保存补丁集（补丁是指文件修订前后的变化）；通过应用所有的补丁，可以重新计算出各个版本的文件内容

#### 集中化的版本控制系统

接下来人们又遇到一个问题，如何让在不同系统上的开发者协同工作？于是，集中化的版本控制系统（Centralized Version Control Systems，简称 CVCS）应运而生。这类系统，诸如 CVS、Subversion 以及 Perforce 等，都有一个单一的集中管理的服务器，保存所有文件的修订版本，而协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新。多年以来，这已成为版本控制系统的标准做法

![集中化的版本控制](https://git-scm.com/book/en/v2/images/centralized.png)

这种做法带来了许多好处，特别是相较于老式的本地 VCS 来说。现在，每个人都可以在一定程度上看到项目中的其他人正在做些什么。而管理员也可以轻松掌控每个开发者的权限，并且管理一个 CVCS 要远比在各个客户端上维护本地数据库来得轻松容易

事分两面，有好有坏。这么做最显而易见的缺点是中央服务器的单点故障。如果宕机一小时，那么在这一小时内，谁都无法提交更新，也就无法协同工作。如果中心数据库所在的磁盘发生损坏，又没有做恰当备份，毫无疑问你将丢失所有数据 — 包括项目的整个变更历史，只剩下人们在各自机器上保留的单独快照。本地版本控制系统也存在类似问题，只要整个项目的历史记录被保存在单一位置，就有丢失所有历史更新记录的风险

#### 分布式版本控制系统

于是分布式版本控制系统（Distributed Version Control System，简称 DVCS）面世了。在这类系统中，像 Git、Mercurial、Bazaar 以及 Darcs 等，客户端并不只提取最新版本的文件快照，而是把代码仓库完整地镜像下来，包括完整的历史记录。这么一来，任何一处协同工作用的服务器发生故障，事后都可以用任何一个镜像出来的本地仓库恢复。因为每一次的克隆操作，实际上都是一次对代码仓库的完整备份

![分布式版本控制](https://git-scm.com/book/en/v2/images/distributed.png)

更进一步，许多这类系统都可以指定和若干不同的远端代码仓库进行交互。因此，你就可以在同一个项目中，分别和不同工作小组的人相互协作。你可以根据需要设定不同的协作流程，比如层次模型式的工作流，而这在以前的集中式系统中是无法实现的

### Git 是什么

那么，简单地说，Git 究竟是怎样的一个系统呢？请注意接下来的内容非常重要，若你理解了 Git 的思想和基本工作原理，用起来就会知其所以然，游刃有余。在学习 Git 时，请尽量理清你对其它版本管理系统已有的认识，如 CVS、Subversion 或 Perforce，这样能帮助你使用工具时避免发生混淆。尽管 Git 用起来与其它的版本控制系统非常相似，但它在对信息的存储和认知方式上却有很大差异，理解这些差异将有助于避免使用中的困惑

#### 直接记录快照，而非差异比较

Git 和其它版本控制系统（包括 Subversion 和近似工具）的主要差别在于 Git 对待数据的方式。从概念上来说，其它大部分系统以文件变更列表的方式存储信息，这类系统（CVS、Subversion、Perforce、Bazaar 等等）将它们存储的信息看作是一组基本文件和每个文件随时间逐步累积的差异（它们通常称作**基于差异（delta-based）**的版本控制）

![存储每个文件与初始版本的差异](https://git-scm.com/book/en/v2/images/deltas.png)

Git 不按照以上方式对待或保存数据。反之，Git 更像是把数据看作是对小型文件系统的一系列快照。在 Git 中，每当你提交更新或保存项目状态时，它基本上就会对当时的全部文件创建一个快照并保存这个快照的索引。为了效率，如果文件没有修改，Git 不再重新存储该文件，而是只保留一个链接指向之前存储的文件。Git 对待数据更像是一个**快照流**

![存储项目随时间改变的快照](https://git-scm.com/book/en/v2/images/snapshots.png)

这是 Git 与几乎所有其它版本控制系统的重要区别。因此 Git 重新考虑了以前每一代版本控制系统延续下来的诸多方面。Git 更像是一个小型的文件系统，提供了许多以此为基础构建的超强工具，而不只是一个简单的 VCS。稍后我们在 Git 分支讨论 Git 分支管理时，将探究这种方式对待数据所能获得的益处

#### 近乎所有操作都是本地执行

在 Git 中的绝大多数操作都只需要访问本地文件和资源，一般不需要来自网络上其它计算机的信息。如果你习惯于所有操作都有网络延时开销的集中式版本控制系统，Git 在这方面会让你感到速度之神赐给了 Git 超凡的能量。因为你在本地磁盘上就有项目的完整历史，所以大部分操作看起来瞬间完成

举个例子，要浏览项目的历史，Git 不需外连到服务器去获取历史，然后再显示出来 — 它只需直接从本地数据库中读取。你能立即看到项目历史。如果你想查看当前版本与一个月前的版本之间引入的修改，Git 会查找到一个月前的文件做一次本地的差异计算，而不是由远程服务器处理或从远程服务器拉回旧版本文件再来本地处理

这也意味着你在离线或者没有 VPN 时，几乎可以进行任何操作。如你在飞机或火车上想做些工作，就能愉快地提交，直到有网络连接时再上传。如你回家后 VPN 客户端不正常，那么也仍能工作。使用其它系统的话，做到这些是不可能或很费力的。比如，用 Perforce 的话，没有连接服务器时几乎不能做什么事；而用 Subversion 和 CVS 的话，你能修改文件，但不能向数据库提交修改（因为你的本地数据库离线了）。这样似乎问题不大，但是你可能会惊喜地发现它带来的巨大的不同

#### Git 保证完整性

Git 中所有的数据在存储前都计算校验和，然后以校验和来引用。这意味着不可能在 Git 不知情时更改任何文件内容或目录内容。这个功能建构在 Git 底层，是构成 Git 哲学不可或缺的部分。若你在传送过程中丢失信息或损坏文件，Git 就能发现

Git 用以计算校验和的机制叫做 SHA-1 散列（hash，哈希）。这是一个由 40 个十六进制字符（0-9 和 a-f）组成的字符串，基于 Git 中文件的内容或目录结构计算出来。SHA-1 哈希看起来是这样：

```text
24b9da6552252987aa493b52f8696cd6d3b00373
```

Git 中使用这种哈希值的情况很多，你将经常看到这种哈希值。实际上，Git 数据库中保存的信息都是以文件内容的哈希值来索引，而不是文件名

#### 三种状态

现在请注意，如果你希望后面的学习更顺利，请记住下面这些关于 Git 的概念。Git 有三种状态，你的文件可能处于其中之一：已提交（committed）、已修改（modified）和已暂存（staged）

- 已修改表示修改了文件，但还没保存到数据库中

- 已暂存表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中

- 已提交表示数据已经安全地保存在本地数据库中

这会让我们的 Git 项目拥有三个阶段：工作区、暂存区以及 Git 目录

![工作目录、暂存区域以及 Git 仓库](https://git-scm.com/book/en/v2/images/areas.png)

工作区是对项目的某个版本独立提取出来的内容。这些从 Git 仓库的压缩数据库中提取出来的文件，放在磁盘上供你使用或修改

暂存区是一个文件，保存了下次将要提交的文件列表信息，一般在 Git 仓库目录中。按照 Git 的术语叫做“索引”，不过一般说法还是叫“暂存区”

Git 仓库目录是 Git 用来保存项目的元数据和对象数据库的地方。这是 Git 中最重要的部分，从其它计算机克隆仓库时，复制的就是这里的数据

基本的 Git 工作流程如下：

1. 在工作区中修改文件

2. 将你想要下次提交的更改选择性地暂存，这样只会将更改的部分添加到暂存区

3. 提交更新，找到暂存区的文件，将快照永久性存储到 Git 目录

如果 Git 目录中保存着特定版本的文件，就属于**已提交**状态。如果文件已修改并放入暂存区，就属于**已暂存**状态。如果自上次检出后，作了修改但还没有放到暂存区域，就是**已修改**状态

## Git 基础

### 获取 Git 仓库

通常有两种获取 Git 项目仓库的方式：

1. 将尚未进行版本控制的本地目录转换为 Git 仓库

2. 从其它服务器 克隆 一个已存在的 Git 仓库

两种方式都会在你的本地机器上得到一个工作就绪的 Git 仓库

#### 在已存在目录中初始化仓库

如果你有一个尚未进行版本控制的项目目录，想要用 Git 来控制它，进入该项目目录中执行初始化命令：

```shell
$ git init
```

该命令将创建一个名为 .git 的子目录，这个子目录含有你初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。 但是在这个时候，我们仅仅是做了一个初始化的操作，你的项目里的文件还没有被跟踪（详见 [Git 内部原理](#底层命令与上层命令) 来了解更多关于到底 .git 文件夹中包含了哪些文件的信息）

#### 克隆现有的仓库

如果你想获得一份已经存在了的 Git 仓库的拷贝，比如说，你想为某个开源项目贡献自己的一份力，这时就要用到 `git clone` 命令。如果你对其它的 VCS 系统（比如说 Subversion）很熟悉，请留心一下你所使用的命令是“clone”而不是“checkout”。这是 Git 区别于其它版本控制系统的一个重要特性，Git 克隆的是该 Git 仓库服务器上的几乎所有数据，而不是仅仅复制完成你的工作所需要文件。当你执行 `git clone` 命令的时候，默认配置下远程 Git 仓库中的每一个文件的每一个版本都将被拉取下来。事实上，如果你的服务器的磁盘坏掉了，你通常可以使用任何一个克隆下来的用户端来重建服务器上的仓库（虽然可能会丢失某些服务器端的钩子（hook）设置，但是所有版本的数据仍在，详见 [在服务器上搭建 Git](#在服务器上搭建-git)）

克隆仓库的命令是 `git clone <url>` 比如，要克隆 Git 的链接库 libgit2，可以用下面的命令：

```shell
$ git clone https://github.com/libgit2/libgit2
```

这会在当前目录下创建一个名为“libgit2”的目录，并在这个目录下初始化一个 .git 文件夹，从远程仓库拉取下所有数据放入 .git 文件夹，然后从中读取最新版本的文件的拷贝。如果你进入到这个新建的 libgit2 文件夹，你会发现所有的项目文件已经在里面了，准备就绪等待后续的开发和使用

如果你想在克隆远程仓库的时候，自定义本地仓库的名字，你可以通过额外的参数指定新的目录名：

```shell
$ git clone https://github.com/libgit2/libgit2 mylibgit
```

这会执行与上一条命令相同的操作，但目标目录名变为了 mylibgit

### 记录每次更新到仓库

现在我们的机器上有了一个真实项目的 Git 仓库，并从这个仓库中检出了所有文件的工作副本。 通常，你会对这些文件做些修改，每当实现了一个阶段的目标，想要将记录下它时，就将它提交到仓库

请记住，你工作目录下的每一个文件都不外乎这两种状态：**已跟踪**或**未跟踪**。已跟踪的文件是指那些被纳入了版本控制的文件，在上一次快照中有它们的记录，在工作一段时间后，它们的状态可能是未修改，已修改或已放入暂存区。简而言之，已跟踪的文件就是 Git 已经知道的文件

工作目录中除已跟踪文件外的其它所有文件都属于未跟踪文件，它们既不存在于上次快照的记录中，也没有被放入暂存区。初次克隆某个仓库的时候，工作目录中的所有文件都属于已跟踪文件，并处于未修改状态，因为 Git 刚刚检出了它们，而你尚未编辑过它们

编辑过某些文件之后，由于自上次提交后你对它们做了修改，Git 将它们标记为已修改文件。在工作时，你可以选择性地将这些修改过的文件放入暂存区，然后提交所有已暂存的修改，如此反复

#### 检查当前文件状态

可以用 `git status` 命令查看哪些文件处于什么状态。如果在克隆仓库后立即使用此命令，会看到类似这样的输出：

```text
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
nothing to commit, working directory clean
```

这说明你现在的工作目录相当干净。换句话说，所有已跟踪文件在上次提交后都未被更改过。此外，上面的信息还表明，当前目录下没有出现任何处于未跟踪状态的新文件，否则 Git 会在这里列出来。最后，该命令还显示了当前所在分支，并告诉你这个分支同远程服务器上对应的分支没有偏离。现在分支名是“master”，这是默认的分支名。我们在 [Git 分支](#git-分支) 中会详细讨论分支和引用

现在，让我们在项目下创建一个新的 README 文件。如果之前并不存在这个文件，使用 `git status` 命令，你将看到一个新的未跟踪文件：

```text
$ echo 'My Project' > README
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Untracked files:
  (use "git add <file>..." to include in what will be committed)

    README

nothing added to commit but untracked files present (use "git add" to track)
```

在状态报告中可以看到新建的 README 文件出现在 Untracked files 下面。未跟踪的文件意味着 Git 在之前的快照（提交）中没有这些文件；Git 不会自动将之纳入跟踪范围，除非你明明白白地告诉它“我需要跟踪该文件”。这样的处理让你不必担心将生成的二进制文件或其它不想被跟踪的文件包含进来。不过现在的例子中，我们确实想要跟踪管理 README 这个文件

#### 跟踪新文件

使用命令 `git add` 开始跟踪一个文件。所以，要跟踪 README 文件，运行：

```shell
$ git add README
```

此时再运行 `git status` 命令，会看到 README 文件已被跟踪，并处于暂存状态：

```text
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)

    new file:   README
```

只要在 Changes to be committed 这行下面的，就说明是已暂存状态。如果此时提交，那么该文件在你运行 `git add` 时的版本将被留存在后续的历史记录中。你可能会想起之前我们使用 `git init` 后就运行了 `git add <files>` 命令，开始跟踪当前目录下的文件。`git add` 命令使用文件或目录的路径作为参数；如果参数是目录的路径，该命令将递归地跟踪该目录下的所有文件

#### 暂存已修改的文件

现在我们来修改一个已被跟踪的文件。如果你修改了一个名为 CONTRIBUTING.md 的已被跟踪的文件，然后运行 `git status` 命令，会看到下面内容：

```text
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```

文件 CONTRIBUTING.md 出现在 Changes not staged for commit 这行下面，说明已跟踪文件的内容发生了变化，但还没有放到暂存区。要暂存这次更新，需要运行 `git add` 命令。这是个多功能命令：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等。将这个命令理解为“精确地将内容添加到下一次提交中”而不是“将一个文件添加到项目中”要更加合适。现在让我们运行 `git add` 将“CONTRIBUTING.md”放到暂存区，然后再看看 `git status` 的输出：

```text
git add CONTRIBUTING.md
git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
    modified:   CONTRIBUTING.md
```

现在两个文件都已暂存，下次提交时就会一并记录到仓库。假设此时，你想要在 CONTRIBUTING.md 里再加条注释。重新编辑存盘后，准备好提交。不过且慢，再运行 `git status` 看看：

```text
$ vim CONTRIBUTING.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
    modified:   CONTRIBUTING.md

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```

怎么回事？现在 CONTRIBUTING.md 文件同时出现在暂存区和非暂存区。这怎么可能呢？ 好吧，实际上 Git 只不过暂存了你运行 `git add` 命令时的版本。如果你现在提交，CONTRIBUTING.md 的版本是你最后一次运行 `git add` 命令时的那个版本，而不是你运行 `git commit` 时，在工作目录中的当前版本。所以，运行了 `git add` 之后又作了修订的文件，需要重新运行 `git add` 把最新版本重新暂存起来：

```text
$ git add CONTRIBUTING.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
    modified:   CONTRIBUTING.md
```

#### 状态简览

`git status` 命令的输出十分详细，但其用语有些繁琐。Git 有一个选项可以帮你缩短状态命令的输出，这样可以以简洁的方式查看更改。如果你使用 `git status -s` 命令或 `git status --short` 命令，你将得到一种格式更为紧凑的输出：

```shell
$ git status -s
 M README
MM Rakefile
A  lib/git.rb
M  lib/simplegit.rb
?? LICENSE.txt
```

新添加的未跟踪文件前面有 ?? 标记，新添加到暂存区中的文件前面有 A 标记，修改过的文件前面有 M 标记。输出中有两栏，左栏指明了暂存区的状态，右栏指明了工作区的状态。例如，上面的状态报告显示：README 文件在工作区已修改但尚未暂存，而 lib/simplegit.rb 文件已修改且已暂存。Rakefile 文件已修改，暂存后又作了修改，因此该文件的修改中既有已暂存的部分，又有未暂存的部分

#### 忽略文件

一般我们总会有些文件无需纳入 Git 的管理，也不希望它们总出现在未跟踪文件列表。通常都是些自动生成的文件，比如日志文件，或者编译过程中创建的临时文件等。在这种情况下，我们可以创建一个名为 .gitignore 的文件，列出要忽略的文件的模式。来看一个实际的 .gitignore 例子：

```text
$ cat .gitignore
*.[oa]
*~
```

第一行告诉 Git 忽略所有以 .o 或 .a 结尾的文件。一般这类对象文件和存档文件都是编译过程中出现的。第二行告诉 Git 忽略所有名字以波浪符（~）结尾的文件，许多文本编辑软件（比如 Emacs）都用这样的文件名保存副本。此外，你可能还需要忽略 log，tmp 或者 pid 目录，以及自动生成的文档等等。要养成一开始就为你的新仓库设置好 .gitignore 文件的习惯，以免将来误提交这类无用的文件

文件 .gitignore 的格式规范如下：

- 所有空行或者以 # 开头的行都会被 Git 忽略。

- 可以使用标准的 glob 模式匹配，它会递归地应用在整个工作区中。

- 匹配模式可以以（/）开头防止递归。

- 匹配模式可以以（/）结尾指定目录。

- 要忽略指定模式以外的文件或目录，可以在模式前加上叹号（!）取反。

我们再看一个 .gitignore 文件的例子：

```text
# 忽略所有的 .a 文件
*.a

# 但跟踪所有的 lib.a，即便你在前面忽略了 .a 文件
!lib.a

# 只忽略当前目录下的 TODO 文件，而不忽略 subdir/TODO
/TODO

# 忽略任何目录下名为 build 的文件夹
build/

# 忽略 doc/notes.txt，但不忽略 doc/server/arch.txt
doc/*.txt

# 忽略 doc/ 目录及其所有子目录下的 .pdf 文件
doc/**/*.pdf
```

#### 提交更新

现在的暂存区已经准备就绪，可以提交了。在此之前，请务必确认还有什么已修改或新建的文件还没有 `git add` 过，否则提交的时候不会记录这些尚未暂存的变化。这些已修改但未暂存的文件只会保留在本地磁盘。所以，每次准备提交前，先用 `git status` 看下，你所需要的文件是不是都已暂存起来了，然后再运行提交命令 `git commit`：

```shell
$ git commit
```

这样会启动你选择的文本编辑器来输入提交说明

编辑器会显示类似下面的文本信息（本例选用 Vim 的屏显方式展示）：

```text
# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# On branch master
# Your branch is up-to-date with 'origin/master'.
#
# Changes to be committed:
#	new file:   README
#	modified:   CONTRIBUTING.md
#
~
~
~
".git/COMMIT_EDITMSG" 9L, 283C
```

可以看到，默认的提交消息包含最后一次运行 `git status` 的输出，放在注释行里，另外开头还有一个空行，供你输入提交说明。你完全可以去掉这些注释行，不过留着也没关系，多少能帮你回想起这次更新的内容有哪些

退出编辑器时，Git 会丢弃注释行，用你输入的提交说明生成一次提交

另外，你也可以在 `git commit` 命令后添加 `-m` 选项，将提交信息与命令放在同一行，如下所示：

```text
$ git commit -m "Story 182: Fix benchmarks for speed"
[master 463dc4f] Story 182: Fix benchmarks for speed
 2 files changed, 2 insertions(+)
 create mode 100644 README
```

好，现在你已经创建了第一个提交！可以看到，提交后它会告诉你，当前是在哪个分支（master）提交的，本次提交的完整 SHA-1 校验和是什么（463dc4f），以及在本次提交中，有多少文件修订过，多少行添加和删改过

请记住，提交时记录的是放在暂存区域的快照。任何还未暂存文件的仍然保持已修改状态，可以在下次提交时纳入版本管理。每一次运行提交操作，都是对你项目作一次快照，以后可以回到这个状态，或者进行比较

#### 跳过使用暂存区域

尽管使用暂存区域的方式可以精心准备要提交的细节，但有时候这么做略显繁琐。Git 提供了一个跳过使用暂存区域的方式，只要在提交的时候，给 `git commit` 加上 `-a` 选项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 `git add` 步骤：

```text
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md

no changes added to commit (use "git add" and/or "git commit -a")
$ git commit -a -m 'added new benchmarks'
[master 83e38c7] added new benchmarks
 1 file changed, 5 insertions(+), 0 deletions(-)
```

提交之前不再需要 `git add` 文件“CONTRIBUTING.md”了。 这是因为 `-a` 选项使本次提交包含了所有修改过的文件。这很方便，但是要小心，有时这个选项会将不需要的文件添加到提交中

#### 移除文件

要从 Git 中移除某个文件，就必须要从已跟踪文件清单中移除（确切地说，是从暂存区域移除），然后提交。可以用 `git rm` 命令完成此项工作，并连带从工作目录中删除指定的文件，这样以后就不会出现在未跟踪文件清单中了

如果只是简单地从工作目录中手工删除文件，运行 `git status` 时就会在 “Changes not staged for commit” 部分（也就是未暂存清单）看到：

```text
$ rm PROJECTS.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        deleted:    PROJECTS.md

no changes added to commit (use "git add" and/or "git commit -a")
```

然后再运行 `git rm` 记录此次移除文件的操作：

```text
$ git rm PROJECTS.md
rm 'PROJECTS.md'
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    deleted:    PROJECTS.md
```

下一次提交时，该文件就不再纳入版本管理了。如果要删除之前修改过或已经放到暂存区的文件，则必须使用强制删除选项 -f（译注：即 force 的首字母）。这是一种安全特性，用于防止误删尚未添加到快照的数据，这样的数据不能被 Git 恢复

---

另外一种情况是，我们想把文件从 Git 仓库中删除（亦即从暂存区域移除），但仍然希望保留在当前工作目录中。换句话说，你想让文件保留在磁盘，但是并不想让 Git 继续跟踪。当你忘记添加 .gitignore 文件，不小心把一个很大的日志文件或一堆 .a 这样的编译生成文件添加到暂存区时，这一做法尤其有用。为达到这一目的，可以使用 `--cached` 选项：

1. 首先，确保您的本地仓库与 GitHub 远程仓库同步。可以使用以下命令拉取最新的代码：

    ```shell
    $ git pull origin master
    ```

2. 接下来，您需要使用 `git rm` 命令删除不想提交的文件。运行以下命令，将要删除的文件逐个添加到索引中：

    ```shell
    $ git rm --cached 文件路径/文件名
    ```

    请替换 "文件路径/文件名" 为您要删除的文件的路径和名称。重复此步骤以删除所有需要删除的文件

    选项 `--cached` 表示仅将文件从暂存区中删除，而不会对工作目录中的实际文件进行任何操作。这样做的好处是，您可以保留本地文件的副本，但不会将它们包含在提交中。因此，当您运行 `git rm --cached` 文件路径/文件名 命令时，它将删除指定的文件的索引记录，但不会删除您的实际文件。这样您就可以保留本地文件，同时将其从 Git 提交中排除

    如果您想删除一个整个文件夹（包括文件夹内的所有文件和子文件夹），可以使用 `git rm` 命令的 `-r` 或 `--recursive` 选项。这样可以递归地删除文件夹及其内容

    ```shell
    $ git rm -r --cached 文件夹路径
    ```

3. 完成文件删除后，提交更改并推送到远程仓库：

    ```shell
    $ git commit -m "删除不需要的文件"
    $ git push origin main
    ```

常见问题：

```text
error: the following files have changes staged in the index:
(use --cached to keep the file, or -f to force removal)

error: the following files have local modifications:
(use --cached to keep the file, or -f to force removal)
```

这个错误信息表明在执行 `git rm -r 文件路径` 命令时，Git 检测到一些问题。它提示说有一些文件在索引中有更改或本地有修改

有两个选项可以解决这个问题：

1. 如果您希望保留这些更改或修改，可以使用 `--cached` 选项来保留这些文件，而不删除它们。命令如下：

    ```shell
    $ git rm -r --cached 文件路径
    ```

    这样，这些文件将被从索引中移除，但会保留在工作目录中
   
2. 如果您确定要删除这些文件并丢弃更改，可以使用 `-f` 选项来强制删除文件。请注意，这将不可恢复地删除这些文件的更改。命令如下：

    ```shell
    $ git rm -r -f 文件路径
    ```

#### 移动文件

不像其它的 VCS 系统，Git 并不显式跟踪文件移动操作。如果在 Git 中重命名了某个文件，仓库中存储的元数据并不会体现出这是一次改名操作。不过 Git 非常聪明，它会推断出究竟发生了什么，至于具体是如何做到的，我们稍后再谈

既然如此，当你看到 Git 的 `mv` 命令时一定会困惑不已。要在 Git 中对文件改名，可以这么做：

```shell
$ git mv file_from file_to
```

它会恰如预期般正常工作。实际上，即便此时查看状态信息，也会明白无误地看到关于重命名操作的说明：

```text
$ git mv README.md README
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
```

其实，运行 `git mv` 就相当于运行了下面三条命令：

```shell
$ mv README.md README
$ git rm README.md
$ git add README
```

如此分开操作，Git 也会意识到这是一次重命名，所以不管何种方式结果都一样。两者唯一的区别在于，`git mv` 是一条命令而非三条命令，直接使用 `git mv` 方便得多。不过在使用其他工具重命名文件时，记得在提交前 `git rm` 删除旧文件名，再 `git add` 添加新文件名

### 查看提交历史

在提交了若干更新，又或者克隆了某个项目之后，你也许想回顾下提交历史。完成这个任务最简单而又有效的工具是 `git log` 命令

我们使用一个非常简单的 "simplegit" 项目作为示例。 运行下面的命令获取该项目：

```shell
$ git clone https://github.com/schacon/simplegit-progit
```

当你在此项目中运行 `git log` 命令时，可以看到下面的输出：

```text
$ git log
commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Mar 17 21:52:11 2008 -0700

    changed the version number

commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Sat Mar 15 16:40:33 2008 -0700

    removed unnecessary test

commit a11bef06a3f659402fe7563abf99ad00de2209e6
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Sat Mar 15 10:31:28 2008 -0700

    first commit
```

不传入任何参数的默认情况下，`git log` 会按时间先后顺序列出所有的提交，最近的更新排在最上面。正如你所看到的，这个命令会列出每个提交的 SHA-1 校验和、作者的名字和电子邮件地址、提交时间以及提交说明

`git log` 有许多选项可以帮助你搜寻你所要找的提交，下面我们会介绍几个最常用的选项

其中一个比较有用的选项是 `-p` 或 `--patch`，它会显示每次提交所引入的差异（按补丁的格式输出）。你也可以限制显示的日志条目数量，例如使用 `-2` 选项来只显示最近的两次提交：

```text
$ git log -p -2
commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Mar 17 21:52:11 2008 -0700

    changed the version number

diff --git a/Rakefile b/Rakefile
index a874b73..8f94139 100644
--- a/Rakefile
+++ b/Rakefile
@@ -5,7 +5,7 @@ require 'rake/gempackagetask'
 spec = Gem::Specification.new do |s|
     s.platform  =   Gem::Platform::RUBY
     s.name      =   "simplegit"
-    s.version   =   "0.1.0"
+    s.version   =   "0.1.1"
     s.author    =   "Scott Chacon"
     s.email     =   "schacon@gee-mail.com"
     s.summary   =   "A simple gem for using Git in Ruby code."

commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Sat Mar 15 16:40:33 2008 -0700

    removed unnecessary test

diff --git a/lib/simplegit.rb b/lib/simplegit.rb
index a0a60ae..47c6340 100644
--- a/lib/simplegit.rb
+++ b/lib/simplegit.rb
@@ -18,8 +18,3 @@ class SimpleGit
     end

 end
-
-if $0 == __FILE__
-  git = SimpleGit.new
-  puts git.show
-end
```

该选项除了显示基本信息之外，还附带了每次提交的变化。当进行代码审查，或者快速浏览某个搭档的提交所带来的变化的时候，这个参数就非常有用了。你也可以为 `git log` 附带一系列的总结性选项。比如你想看到每次提交的简略统计信息，可以使用 `--stat` 选项：

```text
$ git log --stat
commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Mar 17 21:52:11 2008 -0700

    changed the version number

 Rakefile | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Sat Mar 15 16:40:33 2008 -0700

    removed unnecessary test

 lib/simplegit.rb | 5 -----
 1 file changed, 5 deletions(-)

commit a11bef06a3f659402fe7563abf99ad00de2209e6
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Sat Mar 15 10:31:28 2008 -0700

    first commit

 README           |  6 ++++++
 Rakefile         | 23 +++++++++++++++++++++++
 lib/simplegit.rb | 25 +++++++++++++++++++++++++
 3 files changed, 54 insertions(+)
```

正如你所看到的，`--stat` 选项在每次提交的下面列出所有被修改过的文件、有多少文件被修改了以及被修改过的文件的哪些行被移除或是添加了。在每次提交的最后还有一个总结

另一个非常有用的选项是 `--pretty`。这个选项可以使用不同于默认格式的方式展示提交历史。这个选项有一些内建的子选项供你使用。比如 `oneline` 会将每个提交放在一行显示，在浏览大量的提交时非常有用。另外还有 `short`，`full` 和 `fuller` 选项，它们展示信息的格式基本一致，但是详尽程度不一：

```text
$ git log --pretty=oneline
ca82a6dff817ec66f44342007202690a93763949 changed the version number
085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7 removed unnecessary test
a11bef06a3f659402fe7563abf99ad00de2209e6 first commit
```

最有意思的是 `format` ，可以定制记录的显示格式。这样的输出对后期提取分析格外有用，因为你知道输出的格式不会随着 Git 的更新而发生改变：

```text
$ git log --pretty=format:"%h - %an, %ar : %s"
ca82a6d - Scott Chacon, 6 years ago : changed the version number
085bb3b - Scott Chacon, 6 years ago : removed unnecessary test
a11bef0 - Scott Chacon, 6 years ago : first commit
```

git log --pretty=format [常用的选项](https://git-scm.com/book/zh/v2/Git-%E5%9F%BA%E7%A1%80-%E6%9F%A5%E7%9C%8B%E6%8F%90%E4%BA%A4%E5%8E%86%E5%8F%B2#pretty_format) 列出了 format 接受的常用格式占位符的写法及其代表的意义

### 撤消操作

在任何一个阶段，你都有可能想要撤消某些操作。这里，我们将会学习几个撤消你所做修改的基本工具。注意，有些撤消操作是不可逆的。这是在使用 Git 的过程中，会因为操作失误而导致之前的工作丢失的少有的几个地方之一

有时候我们提交完了才发现漏掉了几个文件没有添加，或者提交信息写错了。此时，可以运行带有 `--amend` 选项的提交命令来重新提交：

```shell
$ git commit --amend
```

这个命令会将暂存区中的文件提交。如果自上次提交以来你还未做任何修改（例如，在上次提交后马上执行了此命令），那么快照会保持不变，而你所修改的只是提交信息

文本编辑器启动后，可以看到之前的提交信息。编辑后保存会覆盖原来的提交信息

例如，你提交后发现忘记了暂存某些需要的修改，可以像下面这样操作：

```shell
$ git commit -m 'initial commit'
$ git add forgotten_file
$ git commit --amend
```

最终你只会有一个提交：第二次提交将代替第一次提交的结果

#### 取消暂存的文件

接下来的两个小节演示如何操作暂存区和工作目录中已修改的文件。这些命令在修改文件状态的同时，也会提示如何撤消操作。例如，你已经修改了两个文件并且想要将它们作为两次独立的修改提交，但是却意外地输入 `git add *` 暂存了它们两个。如何只取消暂存两个中的一个呢？`git status` 命令提示了你：

```text
$ git add *
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
    modified:   CONTRIBUTING.md
```

在 “Changes to be committed” 文字正下方，提示使用 `git reset HEAD <file>…` 来取消暂存。所以，我们可以这样来取消暂存 CONTRIBUTING.md 文件：

```text
$ git reset HEAD CONTRIBUTING.md
Unstaged changes after reset:
M	CONTRIBUTING.md
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```

CONTRIBUTING.md 文件已经是修改未暂存的状态了。到目前为止这个神奇的调用就是你需要对 `git reset` 命令了解的全部。我们将会在 [重置揭密](#重置揭密) 中了解 `reset` 的更多细节以及如何掌握它做一些真正有趣的事

#### 回退版本

`git reset` 命令用于将 HEAD 移动到指定的提交，并可以根据不同的选项来处理暂存区和工作目录的更改。三个选项 `--mixed`，`--soft` 和 `--hard` 分别表示不同的行为：

`--mixed`（默认选项）这是 `git reset` 的默认选项。使用 `--mixed` 选项时，它会将 HEAD 移动到指定的提交，并清空暂存区，但保留工作目录中的更改。这些更改将变为未暂存状态

暂存区将被清空，工作目录中的更改仍然保留，但变为未暂存状态。你可以在随后的提交中将它们重新暂存并提交

```shell
$ git reset --mixed <commit_hash>
```

使用 `--soft` 选项时，它会将 HEAD 移动到指定的提交，但保留暂存区和工作目录中的更改。这些更改仍然处于暂存状态，可以在下一次提交中包含它们

暂存区的内容保持不变，工作目录中的更改也保持不变，但它们仍然处于暂存状态。你可以随时提交它们

```shell
$ git reset --soft <commit_hash>
```

使用 `--hard` 选项时，它会将 HEAD 移动到指定的提交，并清空暂存区，同时丢弃工作目录中未提交的更改。这是一个慎用的选项，因为未提交的更改将不可恢复

暂存区的内容将被清空，工作目录中未提交的更改将被永久删除

```shell
$ git reset --hard <commit_hash> # 回退到某个版本回退点之前的所有信息
$ git reset --hard origin/master    # 将本地的状态回退到和远程的一样
```

`git reset HEAD` 是一个用于取消暂存区中的更改的命令。它的作用是将暂存区中的文件状态恢复到与最后一次提交相同的状态，但保留工作目录中的更改。这个命令通常用于取消 `git add` 命令添加到暂存区的文件，从而使这些文件不被包含在下一次提交中

```shell
$ git reset HEAD^ 或者 $ git reset HEAD~1 回退了上一个版本
$ git reset HEAD^^ 或者 $ git reset HEAD~2 回退了上两个版本
$ git reset HEAD^^^ 或者 $ git reset HEAD~3 回退了上三个版本
$ git reset HEAD^ hello.php 回退 hello.php 文件的版本到上一个版本
```

#### 撤消对文件的修改

如果你并不想保留对 CONTRIBUTING.md 文件的修改怎么办？你该如何方便地撤消修改 — 将它还原成上次提交时的样子（或者刚克隆完的样子，或者刚把它放入工作目录时的样子）？幸运的是，`git status` 也告诉了你应该如何做。在最后一个例子中，未暂存区域是这样：

```text
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```

它非常清楚地告诉了你如何撤消之前所做的修改。让我们来按照提示执行：

```text
$ git checkout -- CONTRIBUTING.md
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
```

可以看到那些修改已经被撤消了（请务必记得 `git checkout-<file>` 是一个危险的命令。你对那个文件在本地的任何修改都会消失 — Git 会用最近提交的版本覆盖掉它。除非你确实清楚不想要对那个文件的本地修改了，否则请不要使用这个命令）

如果你仍然想保留对那个文件做出的修改，但是现在仍然需要撤消，我们将会在 [Git 分支](#git-分支) 介绍保存进度与分支，这通常是更好的做法

记住，在 Git 中任何 已提交的东西几乎总是可以恢复的。甚至那些被删除的分支中的提交或使用 `--amend` 选项覆盖的提交也可以恢复 （阅读 [数据恢复](#数据恢复) 了解数据恢复）。然而，任何你未提交的东西丢失后很可能再也找不到了

### 远程仓库的使用

为了能在任意 Git 项目上协作，你需要知道如何管理自己的远程仓库。远程仓库是指托管在因特网或其他网络中的你的项目的版本库。你可以有好几个远程仓库，通常有些仓库对你只读，有些则可以读写。与他人协作涉及管理远程仓库以及根据需要推送或拉取数据。管理远程仓库包括了解如何添加远程仓库、移除无效的远程仓库、管理不同的远程分支并定义它们是否被跟踪等等。在本节中，我们将介绍一部分远程管理的技能

注意：远程仓库可以在你的本地主机上（你完全可以在一个“远程”仓库上工作，而实际上它在你本地的主机上。词语“远程”未必表示仓库在网络或互联网上的其它位置，而只是表示它在别处。在这样的远程仓库上工作，仍然需要和其它远程仓库上一样的标准推送、拉取和抓取操作）

#### 查看远程仓库

如果想查看你已经配置的远程仓库服务器，可以运行 `git remote` 命令。它会列出你指定的每一个远程服务器的简写。如果你已经克隆了自己的仓库，那么至少应该能看到 `origin` — 这是 Git 给你克隆的仓库服务器的默认名字：

你也可以指定选项 `-v`，会显示需要读写远程仓库使用的 Git 保存的简写与其对应的 URL

```shell
$ git remote -v
origin	https://github.com/schacon/ticgit (fetch)
origin	https://github.com/schacon/ticgit (push)
```

#### 添加远程仓库

我们在之前的章节中已经提到并展示了 `git clone` 命令是如何自行添加远程仓库的，不过这里将告诉你如何自己来添加它。运行 `git remote add <shortname> <url>` 添加一个新的远程 Git 仓库，同时指定一个方便使用的简写：

```shell
$ git remote
origin
$ git remote add pb https://github.com/paulboone/ticgit
$ git remote -v
origin	https://github.com/schacon/ticgit (fetch)
origin	https://github.com/schacon/ticgit (push)
pb	https://github.com/paulboone/ticgit (fetch)
pb	https://github.com/paulboone/ticgit (push)
```

现在你可以在命令行中使用字符串 pb 来代替整个 URL。例如，如果你想拉取 Paul 的仓库中有但你没有的信息，可以运行 `git fetch pb`：

```text
$ git fetch pb
remote: Counting objects: 43, done.
remote: Compressing objects: 100% (36/36), done.
remote: Total 43 (delta 10), reused 31 (delta 5)
Unpacking objects: 100% (43/43), done.
From https://github.com/paulboone/ticgit
 * [new branch]      master     -> pb/master
 * [new branch]      ticgit     -> pb/ticgit
```

现在 Paul 的 master 分支可以在本地通过 pb/master 访问到 — 你可以将它合并到自己的某个分支中，或者如果你想要查看它的话，可以检出一个指向该点的本地分支。（我们将会在 [Git 分支](#git-分支) 中详细介绍什么是分支以及如何使用分支）

#### 从远程仓库中抓取与拉取

就如刚才所见，从远程仓库中获得数据，可以执行：

```shell
$ git fetch <remote>
```

这个命令会访问远程仓库，从中拉取所有你还没有的数据。执行完成后，你将会拥有那个远程仓库中所有分支的引用，可以随时合并或查看

如果你使用 `clone` 命令克隆了一个仓库，命令会自动将其添加为远程仓库并默认以 “origin” 为简写。所以，`git fetch origin` 会抓取克隆（或上一次抓取）后新推送的所有工作。必须注意 `git fetch` 命令只会将数据下载到你的本地仓库 — 它并不会自动合并或修改你当前的工作。当准备好时你必须手动将其合并入你的工作

如果你的当前分支设置了跟踪远程分支（阅读下一节和 [Git 分支](#git-分支) 了解更多信息），那么可以用 `git pull` 命令来自动抓取后合并该远程分支到当前分支。这或许是个更加简单舒服的工作流程。默认情况下，`git clone` 命令会自动设置本地 master 分支跟踪克隆的远程仓库的 master 分支（或其它名字的默认分支）。运行 `git pull` 通常会从最初克隆的服务器上抓取数据并自动尝试合并到当前所在的分支

#### 推送到远程仓库

当你想分享你的项目时，必须将其推送到上游。这个命令很简单：`git push <remote> <branch>`。 当你想要将 master 分支推送到 origin 服务器时（再次说明，克隆时通常会自动帮你设置好那两个名字），那么运行这个命令就可以将你所做的备份到服务器：

```shell
$ git push origin master
```

只有当你有所克隆服务器的写入权限，并且之前没有人推送过时，这条命令才能生效。当你和其他人在同一时间克隆，他们先推送到上游然后你再推送到上游，你的推送就会毫无疑问地被拒绝。你必须先抓取他们的工作并将其合并进你的工作后才能推送。阅读 [Git 分支](#git-分支) 了解如何推送到远程仓库服务器的详细信息

#### 查看某个远程仓库

如果想要查看某一个远程仓库的更多信息，可以使用 `git remote show <remote>` 命令。如果想以一个特定的缩写名运行这个命令，例如 origin，会得到像下面类似的信息：

```text
$ git remote show origin
* remote origin
  Fetch URL: https://github.com/schacon/ticgit
  Push  URL: https://github.com/schacon/ticgit
  HEAD branch: master
  Remote branches:
    master                               tracked
    dev-branch                           tracked
  Local branch configured for 'git pull':
    master merges with remote master
  Local ref configured for 'git push':
    master pushes to master (up to date)
```

它同样会列出远程仓库的 URL 与跟踪分支的信息。这些信息非常有用，它告诉你正处于 master 分支，并且如果运行 `git pull`，就会抓取所有的远程引用，然后将远程 master 分支合并（merge）到本地 master 分支。它也会列出拉取到的所有远程引用

这是一个经常遇到的简单例子。如果你是 Git 的重度使用者，那么还可以通过 `git remote show` 看到更多的信息

```text
$ git remote show origin
* remote origin
  URL: https://github.com/my-org/complex-project
  Fetch URL: https://github.com/my-org/complex-project
  Push  URL: https://github.com/my-org/complex-project
  HEAD branch: master
  Remote branches:
    master                           tracked
    dev-branch                       tracked
    markdown-strip                   tracked
    issue-43                         new (next fetch will store in remotes/origin)
    issue-45                         new (next fetch will store in remotes/origin)
    refs/remotes/origin/issue-11     stale (use 'git remote prune' to remove)
  Local branches configured for 'git pull':
    dev-branch merges with remote dev-branch
    master     merges with remote master
  Local refs configured for 'git push':
    dev-branch                     pushes to dev-branch                     (up to date)
    markdown-strip                 pushes to markdown-strip                 (up to date)
    master                         pushes to master                         (up to date)
```

这个命令列出了当你在特定的分支上执行 `git push` 会自动地推送到哪一个远程分支。它也同样地列出了哪些远程分支不在你的本地，哪些远程分支已经从服务器上移除了，还有当你执行 `git pull` 时哪些本地分支可以与它跟踪的远程分支自动合并

#### 远程仓库的重命名与移除

你可以运行 `git remote rename` 来修改一个远程仓库的简写名。例如，想要将 pb 重命名为 paul，可以用 `git remote rename` 这样做：

```shell
$ git remote rename pb paul
```

值得注意的是这同样也会修改你所有远程跟踪的分支名字。那些过去引用 pb/master 的现在会引用 paul/master

如果因为一些原因想要移除一个远程仓库 — 你已经从服务器上搬走了或不再想使用某一个特定的镜像了，又或者某一个贡献者不再贡献了 — 可以使用 `git remote remove` 或 `git remote rm` ：

```shell
$ git remote remove paul
```

一旦你使用这种方式删除了一个远程仓库，那么所有和这个远程仓库相关的远程跟踪分支以及配置信息也会一起被删除

### 打标签

像其他版本控制系统（VCS）一样，Git 可以给仓库历史中的某一个提交打上标签，以示重要。比较有代表性的是人们会使用这个功能来标记发布结点（ v1.0 、 v2.0 等等）。在本节中，你将会学习如何列出已有的标签、如何创建和删除新的标签、以及不同类型的标签分别是什么

#### 列出标签

在 Git 中列出已有的标签非常简单，只需要输入 `git tag`（可带上可选的 -l 选项 --list）：

```text
$ git tag
v1.0
v2.0
```

如果你只想要完整的标签列表，那么运行 `git tag` 就会默认假定你想要一个列表，它会直接给你列出来，此时的 `-l` 或 `--list` 是可选的。然而，如果你提供了一个匹配标签名的通配模式，那么 `-l` 或 `--list` 就是强制使用的

```text
$ git tag -l "v1.8.5*"
v1.8.5
v1.8.5-rc0
v1.8.5-rc1
v1.8.5-rc2
v1.8.5-rc3
```

#### 创建标签

Git 支持两种标签：轻量标签（lightweight）与附注标签（annotated）

轻量标签很像一个不会改变的分支 — 它只是某个特定提交的引用

而附注标签是存储在 Git 数据库中的一个完整对象，它们是可以被校验的，其中包含打标签者的名字、电子邮件地址、日期时间，此外还有一个标签信息，并且可以使用 GNU Privacy Guard （GPG）签名并验证。通常会建议创建附注标签，这样你可以拥有以上所有信息。但是如果你只是想用一个临时的标签， 或者因为某些原因不想要保存这些信息，那么也可以用轻量标签

#### 附注标签

在 Git 中创建附注标签十分简单。最简单的方式是当你在运行 `tag` 命令时指定 `-a` 选项：

```text
$ git tag -a v1.4 -m "my version 1.4"
$ git tag
v1.4
```

`-m` 选项指定了一条将会存储在标签中的信息。如果没有为附注标签指定一条信息，Git 会启动编辑器要求你输入信息

通过使用 `git show` 命令可以看到标签信息和与之对应的提交信息：

```text
$ git show v1.4
tag v1.4
Tagger: Ben Straub <ben@straub.cc>
Date:   Sat May 3 20:19:12 2014 -0700

my version 1.4

commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Mar 17 21:52:11 2008 -0700

    changed the version number
```

输出显示了打标签者的信息、打标签的日期时间、附注信息，然后显示具体的提交信息

#### 轻量标签

另一种给提交打标签的方式是使用轻量标签。轻量标签本质上是将提交校验和存储到一个文件中 — 没有保存任何其他信息。创建轻量标签，不需要使用 `-a`、`-s` 或 `-m` 选项，只需要提供标签名字：

```text
$ git tag v1.4-lw
$ git tag
v1.4
v1.4-lw
```

这时，如果在标签上运行 `git show`，你不会看到额外的标签信息。命令只会显示出提交信息：

```text
$ git show v1.4-lw
commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Mar 17 21:52:11 2008 -0700

    changed the version number
```

#### 后期打标签

你也可以对过去的提交打标签。假设提交历史是这样的：

```text
$ git log --pretty=oneline
9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme
```

现在，假设在 v1.2 时你忘记给项目打标签，也就是在 “updated rakefile” 提交。你可以在之后补上标签。要在那个提交上打标签，你需要在命令的末尾指定提交的校验和（或部分校验和）：

```shell
$ git tag -a v1.2 9fceb02
```

可以看到你已经在那次提交上打上标签了：

```text
$ git tag
v1.2
v1.4
v1.4-lw
v1.5

$ git show v1.2
tag v1.2
Tagger: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Feb 9 15:32:16 2009 -0800

version 1.2
commit 9fceb02d0ae598e95dc970b74767f19372d61af8
Author: Magnus Chacon <mchacon@gee-mail.com>
Date:   Sun Apr 27 20:43:35 2008 -0700

    updated rakefile
...
```

#### 共享标签

默认情况下，`git push` 命令并不会传送标签到远程仓库服务器上。在创建完标签后你必须显式地推送标签到共享服务器上。这个过程就像共享远程分支一样 — 你可以运行 `git push origin <tagname>`

```text
$ git push origin v1.5
Counting objects: 14, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (12/12), done.
Writing objects: 100% (14/14), 2.05 KiB | 0 bytes/s, done.
Total 14 (delta 3), reused 0 (delta 0)
To git@github.com:schacon/simplegit.git
 * [new tag]         v1.5 -> v1.5
```

如果想要一次性推送很多标签，也可以使用带有 `--tags` 选项的 `git push` 命令。这将会把所有不在远程仓库服务器上的标签全部传送到那里

```text
$ git push origin --tags
Counting objects: 1, done.
Writing objects: 100% (1/1), 160 bytes | 0 bytes/s, done.
Total 1 (delta 0), reused 0 (delta 0)
To git@github.com:schacon/simplegit.git
 * [new tag]         v1.4 -> v1.4
 * [new tag]         v1.4-lw -> v1.4-lw
```

现在，当其他人从仓库中克隆或拉取，他们也能得到你的那些标签

使用 `git push <remote> --tags` 推送标签并不会区分轻量标签和附注标签，没有简单的选项能够让你只选择推送一种标签

#### 删除标签

要删除掉你本地仓库上的标签，可以使用命令 `git tag -d <tagname>`。例如，可以使用以下命令删除一个轻量标签：

```text
$ git tag -d v1.4-lw
Deleted tag 'v1.4-lw' (was e7d5add)
```

注意上述命令并不会从任何远程仓库中移除这个标签，你必须用 `git push <remote> :refs/tags/<tagname>` 来更新你的远程仓库

第一种变体是 `git push <remote> :refs/tags/<tagname>` ：

```text
$ git push origin :refs/tags/v1.4-lw
To /git@github.com:schacon/simplegit.git
 - [deleted]         v1.4-lw
```

上面这种操作的含义是，将冒号前面的空值推送到远程标签名，从而高效地删除它

第二种更直观的删除远程标签的方式是：

```shell
$ git push origin --delete <tagname>
```

## Git 分支

### 分支简介

几乎所有的版本控制系统都以某种形式支持分支。使用分支意味着你可以把你的工作从开发主线上分离开来，以免影响开发主线。在很多版本控制系统中，这是一个略微低效的过程 — 常常需要完全创建一个源代码目录的副本。对于大项目来说，这样的过程会耗费很多时间

有人把 Git 的分支模型称为它的“必杀技特性”，也正因为这一特性，使得 Git 从众多版本控制系统中脱颖而出。为何 Git 的分支模型如此出众呢？Git 处理分支的方式可谓是难以置信的轻量，创建新分支这一操作几乎能在瞬间完成，并且在不同分支之间的切换操作也是一样便捷。与许多其它版本控制系统不同，Git 鼓励在工作流程中频繁地使用分支与合并，哪怕一天之内进行许多次。理解和精通这一特性，你便会意识到 Git 是如此的强大而又独特，并且从此真正改变你的开发方式

为了真正理解 Git 处理分支的方式，我们需要回顾一下 Git 是如何保存数据的。或许你还记得[起步](#起步)的内容，Git 保存的不是文件的变化或者差异，而是一系列不同时刻的**快照**

在进行提交操作时，Git 会保存一个提交对象（commit object）。知道了 Git 保存数据的方式，我们可以很自然的想到 — 该提交对象会包含一个指向暂存内容快照的指针。 但不仅仅是这样，该提交对象还包含了作者的姓名和邮箱、提交时输入的信息以及指向它的父对象的指针。首次提交产生的提交对象没有父对象，普通提交操作产生的提交对象有一个父对象，而由多个分支合并产生的提交对象有多个父对象

为了更加形象地说明，我们假设现在有一个工作目录，里面包含了三个将要被暂存和提交的文件。暂存操作会为每一个文件计算校验和（使用我们在[起步](#起步)中提到的 SHA-1 哈希算法），然后会把当前版本的文件快照保存到 Git 仓库中（Git 使用 blob 对象来保存它们），最终将校验和加入到暂存区域等待提交：

```shell
$ git add README test.rb LICENSE
$ git commit -m 'The initial commit of my project'
```

当使用 `git commit` 进行提交操作时，Git 会先计算每一个子目录（本例中只有项目根目录）的校验和，然后在 Git 仓库中这些校验和保存为树对象。随后，Git 便会创建一个提交对象，它除了包含上面提到的那些信息外，还包含指向这个树对象（项目根目录）的指针。如此一来，Git 就可以在需要的时候重现此次保存的快照

现在，Git 仓库中有五个对象：三个 blob 对象（保存着文件快照）、一个**树**对象（记录着目录结构和 blob 对象索引）以及一个**提交**对象（包含着指向前述树对象的指针和所有提交信息）

![首次提交对象及其树结构](https://git-scm.com/book/en/v2/images/commit-and-tree.png)

做些修改后再次提交，那么这次产生的提交对象会包含一个指向上次提交对象（父对象）的指针

![提交对象及其父对象](https://git-scm.com/book/en/v2/images/commits-and-parents.png)

Git 的分支，其实本质上仅仅是指向提交对象的可变指针。Git 的默认分支名字是 master。在多次提交操作之后，你其实已经有一个指向最后那个提交对象的 master 分支。master 分支会在每次提交时自动向前移动

Git 的 master 分支并不是一个特殊分支。它就跟其它分支完全没有区别。之所以几乎每一个仓库都有 master 分支，是因为 `git init` 命令默认创建它，并且大多数人都懒得去改动它

![分支及其提交历史](https://git-scm.com/book/en/v2/images/branch-and-history.png)

#### 查看分支

```shell
$ git branch # 列出本地分支
$ git branch -r # 列出远程分支
$ git branch -a # 列出本地和远程分支
```

#### 分支创建

Git 是怎么创建新分支的呢？很简单，它只是为你创建了一个可以移动的新的指针。比如，创建一个 testing 分支，你需要使用 `git branch` 命令：

```shell
$ git branch testing
```

这会在当前所在的提交对象上创建一个指针

![两个指向相同提交历史的分支](https://git-scm.com/book/en/v2/images/two-branches.png)

那么，Git 又是怎么知道当前在哪一个分支上呢？也很简单，它有一个名为 HEAD 的特殊指针。请注意它和许多其它版本控制系统（如 Subversion 或 CVS）里的 HEAD 概念完全不同。在 Git 中，它是一个指针，指向当前所在的本地分支（译注：将 HEAD 想象为当前分支的别名）。在本例中，你仍然在 master 分支上。因为 `git branch` 命令仅仅创建一个新分支，并不会自动切换到新分支中去

![HEAD 指向当前所在的分支](https://git-scm.com/book/en/v2/images/head-to-master.png)

你可以简单地使用 `git log` 命令查看各个分支当前所指的对象。提供这一功能的参数是 `--decorate`

```text
$ git log --oneline --decorate
f30ab (HEAD -> master, testing) add feature #32 - ability to add new formats to the central interface
34ac2 Fixed bug #1328 - stack overflow under certain conditions
98ca9 The initial commit of my project
```

正如你所见，当前 master 和 testing 分支均指向校验和以 f30ab 开头的提交对象

#### 分支切换

要切换到一个已存在的分支，你需要使用 `git checkout` 命令。我们现在切换到新创建的 testing 分支去：

```shell
$ git checkout testing
```

这样 HEAD 就指向 testing 分支了

![HEAD 指向当前所在的分支](https://git-scm.com/book/en/v2/images/head-to-testing.png)

那么，这样的实现方式会给我们带来什么好处呢？现在不妨再提交一次：

```shell
$ vim test.rb
$ git commit -a -m 'made a change'
```

![HEAD 分支随着提交操作自动向前移动](https://git-scm.com/book/en/v2/images/advance-testing.png)

如图所示，你的 testing 分支向前移动了，但是 master 分支却没有，它仍然指向运行 `git checkout` 时所指的对象。这就有意思了，现在我们切换回 master 分支看看：

```shell
$ git checkout master
```

![检出时 HEAD 随之移动](https://git-scm.com/book/en/v2/images/checkout-master.png)

这条命令做了两件事。一是使 HEAD 指回 master 分支，二是将工作目录恢复成 master 分支所指向的快照内容。也就是说，你现在做修改的话，项目将始于一个较旧的版本。本质上来讲，这就是忽略 testing 分支所做的修改，以便于向另一个方向进行开发

注意：在切换分支时，一定要注意你工作目录里的文件会被改变。如果是切换到一个较旧的分支，你的工作目录会恢复到该分支最后一次提交时的样子。如果 Git 不能干净利落地完成这个任务，它将禁止切换分支

我们不妨再稍微做些修改并提交：

```shell
$ vim test.rb
$ git commit -a -m 'made other changes'
```

现在，这个项目的提交历史已经产生了分叉。因为刚才你创建了一个新分支，并切换过去进行了一些工作，随后又切换回 master 分支进行了另外一些工作。上述两次改动针对的是不同分支：你可以在不同分支间不断地来回切换和工作，并在时机成熟时将它们合并起来。而所有这些工作，你需要的命令只有 `branch`、`checkout` 和 `commit`

![项目分叉历史](https://git-scm.com/book/en/v2/images/advance-master.png)

你可以简单地使用 `git log` 命令查看分叉历史。运行 `git log --oneline --decorate --graph --all`，它会输出你的提交历史、各个分支的指向以及项目的分支分叉情况

```text
$ git log --oneline --decorate --graph --all
* c2b9e (HEAD, master) made other changes
| * 87ab2 (testing) made a change
|/
* f30ab add feature #32 - ability to add new formats to the
* 34ac2 fixed bug #1328 - stack overflow under certain conditions
* 98ca9 initial commit of my project
```

由于 Git 的分支实质上仅是包含所指对象校验和（长度为 40 的 SHA-1 值字符串）的文件，所以它的创建和销毁都异常高效。创建一个新分支就相当于往一个文件中写入 41 个字节（40 个字符和 1 个换行符），如此的简单能不快吗？

这与过去大多数版本控制系统形成了鲜明的对比，它们在创建分支时，将所有的项目文件都复制一遍，并保存到一个特定的目录。完成这样繁琐的过程通常需要好几秒钟，有时甚至需要好几分钟。所需时间的长短，完全取决于项目的规模。而在 Git 中，任何规模的项目都能在瞬间创建新分支。同时，由于每次提交都会记录父对象，所以寻找恰当的合并基础（译注：即共同祖先）也是同样的简单和高效。这些高效的特性使得 Git 鼓励开发人员频繁地创建和使用分支

通常我们会在创建一个新分支后立即切换过去，这可以用 `git checkout -b <newbranchname>` 一条命令搞定

### 分支的新建与合并

让我们来看一个简单的分支新建与分支合并的例子，实际工作中你可能会用到类似的工作流。你将经历如下步骤：

1. 开发某个网站

2. 为实现某个新的用户需求，创建一个分支

3. 在这个分支上开展工作

正在此时，你突然接到一个电话说有个很严重的问题需要紧急修补。你将按照如下方式来处理：

1. 切换到你的线上分支（production branch）

2. 为这个紧急任务新建一个分支，并在其中修复它

3. 在测试通过之后，切换回线上分支，然后合并这个修补分支，最后将改动推送到线上分支

4. 切换回你最初工作的分支上，继续工作

#### 新建分支

首先，我们假设你正在你的项目上工作，并且在 master 分支上已经有了一些提交

![一个简单提交历史](https://git-scm.com/book/en/v2/images/basic-branching-1.png)

现在，你已经决定要解决你的公司使用的问题追踪系统中的 #53 问题。想要新建一个分支并同时切换到那个分支上，你可以运行一个带有 `-b` 参数的 `git checkout` 命令：

```text
$ git checkout -b iss53
Switched to a new branch "iss53"
```

它是下面两条命令的简写：

```shell
$ git branch iss53
$ git checkout iss53
```

![创建一个新分支指针](https://git-scm.com/book/en/v2/images/basic-branching-2.png)

你继续在 #53 问题上工作，并且做了一些提交。在此过程中，iss53 分支在不断的向前推进，因为你已经检出到该分支（也就是说，你的 HEAD 指针指向了 iss53 分支）

```shell
$ vim index.html
$ git commit -a -m 'added a new footer [issue 53]'
```

![iss53 分支随着工作的进展向前推进](https://git-scm.com/book/en/v2/images/basic-branching-3.png)

现在你接到那个电话，有个紧急问题等待你来解决。有了 Git 的帮助，你不必把这个紧急问题和 iss53 的修改混在一起，你也不需要花大力气来还原关于 53# 问题的修改，然后再添加关于这个紧急问题的修改，最后将这个修改提交到线上分支。你所要做的仅仅是切换回 master 分支

但是，在你这么做之前，要留意你的工作目录和暂存区里那些还没有被提交的修改，它可能会和你即将检出的分支产生冲突从而阻止 Git 切换到该分支。最好的方法是，在你切换分支之前，保持好一个干净的状态。有一些方法可以绕过这个问题（即，暂存（stashing）和修补提交（commit amending）），我们会在[贮藏与清理](#贮藏与清理)中看到关于这两个命令的介绍。现在，我们假设你已经把你的修改全部提交了，这时你可以切换回 master 分支了：

```text
$ git checkout master
Switched to branch 'master'
```

这个时候，你的工作目录和你在开始 #53 问题之前一模一样，现在你可以专心修复紧急问题了。请牢记：当你切换分支的时候，Git 会重置你的工作目录，使其看起来像回到了你在那个分支上最后一次提交的样子。Git 会自动添加、删除、修改文件以确保此时你的工作目录和这个分支最后一次提交时的样子一模一样

接下来，你要修复这个紧急问题。我们来建立一个 hotfix 分支，在该分支上工作直到问题解决：

```text
$ git checkout -b hotfix
Switched to a new branch 'hotfix'
$ vim index.html
$ git commit -a -m 'fixed the broken email address'
[hotfix 1fb7853] fixed the broken email address
 1 file changed, 2 insertions(+)
```

![基于 master 分支的紧急问题分支 hotfix branch](https://git-scm.com/book/en/v2/images/basic-branching-4.png)

你可以运行你的测试，确保你的修改是正确的，然后将 hotfix 分支合并回你的 master 分支来部署到线上。你可以使用 `git merge` 命令来达到上述目的：

```text
$ git checkout master
$ git merge hotfix
Updating f42c576..3a0874c
Fast-forward
 index.html | 2 ++
 1 file changed, 2 insertions(+)
```

在合并的时候，你应该注意到了“快进（fast-forward）”这个词。由于你想要合并的分支 hotfix 所指向的提交 C4 是你所在的提交 C2 的直接后继，因此 Git 会直接将指针向前移动。换句话说，当你试图合并两个分支时，如果顺着一个分支走下去能够到达另一个分支，那么 Git 在合并两者的时候，只会简单的将指针向前推进（指针右移），因为这种情况下的合并操作没有需要解决的分歧 — 这就叫做 “快进（fast-forward）”

现在，最新的修改已经在 master 分支所指向的提交快照中，你可以着手发布该修复了

![master 被快进到 hotfix](https://git-scm.com/book/en/v2/images/basic-branching-5.png)

关于这个紧急问题的解决方案发布之后，你准备回到被打断之前时的工作中。然而，你应该先删除 hotfix 分支，因为你已经不再需要它了 — master 分支已经指向了同一个位置。你可以使用带 -d 选项的 `git branch` 命令来删除分支：

```text
$ git branch -d hotfix
Deleted branch hotfix (3a0874c).
```

现在你可以切换回你正在工作的分支继续你的工作，也就是针对 #53 问题的那个分支（iss53 分支）

```text
$ git checkout iss53
Switched to branch "iss53"
$ vim index.html
$ git commit -a -m 'finished the new footer [issue 53]'
[iss53 ad82d7a] finished the new footer [issue 53]
1 file changed, 1 insertion(+)
```

![继续在 iss53 分支上的工作](https://git-scm.com/book/en/v2/images/basic-branching-6.png)

你在 hotfix 分支上所做的工作并没有包含到 iss53 分支中。如果你需要拉取 hotfix 所做的修改，你可以使用 `git merge master` 命令将 master 分支合并入 iss53 分支，或者你也可以等到 iss53 分支完成其使命，再将其合并回 master 分支

#### 分支的合并

假设你已经修正了 #53 问题，并且打算将你的工作合并入 master 分支。为此，你需要合并 iss53 分支到 master 分支，这和之前你合并 hotfix 分支所做的工作差不多。你只需要检出到你想合并入的分支，然后运行 `git merge` 命令：

```text
$ git checkout master
Switched to branch 'master'
$ git merge iss53
Merge made by the 'recursive' strategy.
index.html |    1 +
1 file changed, 1 insertion(+)
```

这和你之前合并 hotfix 分支的时候看起来有一点不一样。在这种情况下，你的开发历史从一个更早的地方开始分叉开来（diverged）。因为，master 分支所在提交并不是 iss53 分支所在提交的直接祖先，Git 不得不做一些额外的工作。出现这种情况的时候，Git 会使用两个分支的末端所指的快照（C4 和 C5）以及这两个分支的公共祖先（C2），做一个简单的三方合并

![一次典型合并中所用到的三个快照](https://git-scm.com/book/en/v2/images/basic-merging-1.png)

和之前将分支指针向前推进所不同的是，Git 将此次三方合并的结果做了一个新的快照并且自动创建一个新的提交指向它。这个被称作一次合并提交，它的特别之处在于他有不止一个父提交

![一个合并提交](https://git-scm.com/book/en/v2/images/basic-merging-2.png)

既然你的修改已经合并进来了，就不再需要 iss53 分支了。现在你可以在任务追踪系统中关闭此项任务，并删除这个分支

```shell
$ git branch -d iss53
```

#### 遇到冲突时的分支合并

有时候合并操作不会如此顺利。如果你在两个不同的分支中，对同一个文件的同一个部分进行了不同的修改，Git 就没法干净的合并它们。如果你对 #53 问题的修改和有关 hotfix 分支的修改都涉及到同一个文件的同一处，在合并它们的时候就会产生合并冲突：

```text
$ git merge iss53
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

此时 Git 做了合并，但是没有自动地创建一个新的合并提交。Git 会暂停下来，等待你去解决合并产生的冲突。你可以在合并冲突后的任意时刻使用 `git status` 命令来查看那些因包含合并冲突而处于未合并（unmerged）状态的文件：

```text
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)

    both modified:      index.html

no changes added to commit (use "git add" and/or "git commit -a")
```

任何因包含合并冲突而有待解决的文件，都会以未合并状态标识出来。Git 会在有冲突的文件中加入标准的冲突解决标记，这样你可以打开这些包含冲突的文件然后手动解决冲突。出现冲突的文件会包含一些特殊区段，看起来像下面这个样子：

```text
<<<<<<< HEAD:index.html
<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer">
 please contact us at support@github.com
</div>
>>>>>>> iss53:index.html
```

这表示 HEAD 所指示的版本（也就是你的 master 分支所在的位置，因为你在运行 merge 命令的时候已经检出到了这个分支）在这个区段的上半部分（======= 的上半部分），而 iss53 分支所指示的版本在 ======= 的下半部分。为了解决冲突，你必须选择使用由 ======= 分割的两部分中的一个，或者你也可以自行合并这些内容。例如，你可以通过把这段内容换成下面的样子来解决冲突：

```text
<div id="footer">
please contact us at email.support@github.com
</div>
```

上述的冲突解决方案仅保留了其中一个分支的修改，并且 <<<<<<< , ======= , 和 >>>>>>> 这些行被完全删除了。在你解决了所有文件里的冲突之后，对每个文件使用 `git add` 命令来将其标记为冲突已解决。一旦暂存这些原本有冲突的文件，Git 就会将它们标记为冲突已解决

### 分支管理

现在已经创建、合并、删除了一些分支，让我们看看一些常用的分支管理工具

`git branch` 命令不只是可以创建与删除分支。如果不加任何参数运行它，会得到当前所有分支的一个列表：

```text
$ git branch
  iss53
* master
  testing
```

注意 master 分支前的 * 字符：它代表现在检出的那一个分支（也就是说，当前 HEAD 指针所指向的分支）。这意味着如果在这时候提交，master 分支将会随着新的工作向前移动。如果需要查看每一个分支的最后一次提交，可以运行 `git branch -v` 命令：

```text
$ git branch -v
  iss53   93b412c fix javascript issue
* master  7a98805 Merge branch 'iss53'
  testing 782fd34 add scott to the author list in the readmes
```

`--merged` 与 `--no-merged` 这两个有用的选项可以过滤这个列表中已经合并或尚未合并到当前分支的分支。如果要查看哪些分支已经合并到当前分支，可以运行 `git branch --merged`：

```text
$ git branch --merged
  iss53
* master
```

因为之前已经合并了 iss53 分支，所以现在看到它在列表中。在这个列表中分支名字前没有 * 号的分支通常可以使用 `git branch -d` 删除掉；你已经将它们的工作整合到了另一个分支，所以并不会失去任何东西

查看所有包含未合并工作的分支，可以运行 `git branch --no-merged`：

```text
$ git branch --no-merged
  testing
```

这里显示了其他分支。因为它包含了还未合并的工作，尝试使用 `git branch -d` 命令删除它时会失败：

```text
$ git branch -d testing
error: The branch 'testing' is not fully merged.
If you are sure you want to delete it, run 'git branch -D testing'.
```

如果真的想要删除分支并丢掉那些工作，如同帮助信息里所指出的，可以使用 `-D` 选项强制删除它

上面描述的选项 `--merged` 和 `--no-merged` 会在没有给定提交或分支名作为参数时，分别列出已合并或未合并到当前分支的分支

你总是可以提供一个附加的参数来查看其它分支的合并状态而不必检出它们。 例如，尚未合并到 master 分支的有哪些？

```text
$ git checkout testing
$ git branch --no-merged master
  topicA
  featureB
```

### 分支开发工作流

现在你已经学会新建和合并分支，那么你可以或者应该用它来做些什么呢？在本节，我们会介绍一些常见的利用分支进行开发的工作流程。而正是由于分支管理的便捷，才衍生出这些典型的工作模式，你可以根据项目实际情况选择一种用用看

#### 长期分支

因为 Git 使用简单的三方合并，所以就算在一段较长的时间内，反复把一个分支合并入另一个分支，也不是什么难事。也就是说，在整个项目开发周期的不同阶段，你可以同时拥有多个开放的分支；你可以定期地把某些主题分支合并入其他分支中

许多使用 Git 的开发者都喜欢使用这种方式来工作，比如只在 master 分支上保留完全稳定的代码 — 有可能仅仅是已经发布或即将发布的代码。他们还有一些名为 develop 或者 next 的平行分支，被用来做后续开发或者测试稳定性 — 这些分支不必保持绝对稳定，但是一旦达到稳定状态，它们就可以被合并入 master 分支了。这样，在确保这些已完成的主题分支（短期分支，比如之前的 iss53 分支）能够通过所有测试，并且不会引入更多 bug 之后，就可以合并入主干分支中，等待下一次的发布

事实上我们刚才讨论的，是随着你的提交而不断右移的指针。稳定分支的指针总是在提交历史中落后一大截，而前沿分支的指针往往比较靠前

![趋于稳定分支的线性图](https://git-scm.com/book/en/v2/images/lr-branches-1.png)

通常把他们想象成流水线（work silos）可能更好理解一点，那些经过测试考验的提交会被遴选到更加稳定的流水线上去

![趋于稳定分支的流水线（“silo”）视图](https://git-scm.com/book/en/v2/images/lr-branches-2.png)

你可以用这种方法维护不同层次的稳定性。一些大型项目还有一个 proposed（建议）或 pu: proposed updates（建议更新）分支，它可能因包含一些不成熟的内容而不能进入 next 或者 master 分支。这么做的目的是使你的分支具有不同级别的稳定性；当它们具有一定程度的稳定性后，再把它们合并入具有更高级别稳定性的分支中。再次强调一下，使用多个长期分支的方法并非必要，但是这么做通常很有帮助，尤其是当你在一个非常庞大或者复杂的项目中工作时

#### 主题分支

主题分支对任何规模的项目都适用。主题分支是一种短期分支，它被用来实现单一特性或其相关工作。也许你从来没有在其他的版本控制系统（VCS）上这么做过，因为在那些版本控制系统中创建和合并分支通常很费劲。然而，在 Git 中一天之内多次创建、使用、合并、删除分支都很常见

你已经在上一节中你创建的 iss53 和 hotfix 主题分支中看到过这种用法。你在上一节用到的主题分支（iss53 和 hotfix 分支）中提交了一些更新，并且在它们合并入主干分支之后，你又删除了它们。这项技术能使你快速并且完整地进行上下文切换（context-switch） — 因为你的工作被分散到不同的流水线中，在不同的流水线中每个分支都仅与其目标特性相关，因此，在做代码审查之类的工作的时候就能更加容易地看出你做了哪些改动。你可以把做出的改动在主题分支中保留几分钟、几天甚至几个月，等它们成熟之后再合并，而不用在乎它们建立的顺序或工作进度

考虑这样一个例子，你在 master 分支上工作到 C1，这时为了解决一个问题而新建 iss91 分支，在 iss91 分支上工作到 C4，然而对于那个问题你又有了新的想法，于是你再新建一个 iss91v2 分支试图用另一种方法解决那个问题，接着你回到 master 分支工作了一会儿，你又冒出了一个不太确定的想法，你便在 C10 的时候新建一个 dumbidea 分支，并在上面做些实验。你的提交历史看起来像下面这个样子：

![拥有多个主题分支的提交历史](https://git-scm.com/book/en/v2/images/topic-branches-1.png)

现在，我们假设两件事情：你决定使用第二个方案来解决那个问题，即使用在 iss91v2 分支中方案。另外，你将 dumbidea 分支拿给你的同事看过之后，结果发现这是个惊人之举。这时你可以抛弃 iss91 分支（即丢弃 C5 和 C6 提交），然后把另外两个分支合并入主干分支。最终你的提交历史看起来像下面这个样子：

![合并了 dumbidea 和 iss91v2 分支之后的提交历史](https://git-scm.com/book/en/v2/images/topic-branches-2.png)

我们将会在[分布式 Git](#分布式-git)中向你揭示更多有关分支工作流的细节， 因此，请确保你阅读完那个章节之后，再来决定你的下个项目要使用什么样的分支策略（branching scheme）

请牢记，当你做这么多操作的时候，这些分支全部都存于本地。当你新建和合并分支的时候，所有这一切都只发生在你本地的 Git 版本库中 — 没有与服务器发生交互

### 远程分支

远程引用是对远程仓库的引用（指针），包括分支、标签等等。你可以通过 `git ls-remote <remote>` 来显式地获得远程引用的完整列表，或者通过 `git remote show <remote>` 获得远程分支的更多信息。然而，一个更常见的做法是利用远程跟踪分支

远程跟踪分支是远程分支状态的引用。它们是你无法移动的本地引用。一旦你进行了网络通信，Git 就会为你移动它们以精确反映远程仓库的状态。请将它们看做书签，这样可以提醒你该分支在远程仓库中的位置就是你最后一次连接到它们的位置

它们以 `<remote>/<branch>` 的形式命名。例如，如果你想要看你最后一次与远程仓库 origin 通信时 master 分支的状态，你可以查看 origin/master 分支。你与同事合作解决一个问题并且他们推送了一个 iss53 分支，你可能有自己的本地 iss53 分支，然而在服务器上的分支会以 origin/iss53 来表示

这可能有一点儿难以理解，让我们来看一个例子。假设你的网络里有一个在 git.ourcompany.com 的 Git 服务器。如果你从这里克隆，Git 的 clone 命令会为你自动将其命名为 origin，拉取它的所有数据，创建一个指向它的 master 分支的指针，并且在本地将其命名为 origin/master。Git 也会给你一个与 origin 的 master 分支在指向同一个地方的本地 master 分支，这样你就有工作的基础

“origin”并无特殊含义：远程仓库名字“origin”与分支名字“master”一样，在 Git 中并没有任何特别的含义一样。同时 “master” 是当你运行 `git init` 时默认的起始分支名字，原因仅仅是它的广泛使用，“origin” 是当你运行 `git clone` 时默认的远程仓库名字。如果你运行 `git clone -o booyah`，那么你默认的远程分支名字将会是 booyah/master

![克隆之后的服务器与本地仓库](https://git-scm.com/book/en/v2/images/remote-branches-1.png)

如果你在本地的 master 分支做了一些工作，在同一段时间内有其他人推送提交到 git.ourcompany.com 并且更新了它的 master 分支，这就是说你们的提交历史已走向不同的方向。即便这样，只要你保持不与 origin 服务器连接（并拉取数据），你的 origin/master 指针就不会移动

![本地与远程的工作可以分叉](https://git-scm.com/book/en/v2/images/remote-branches-2.png)

如果要与给定的远程仓库同步数据，运行 `git fetch <remote>` 命令（在本例中为 `git fetch origin`）。这个命令查找 origin 是哪一个服务器（在本例中，它是git.ourcompany.com），从中抓取本地没有的数据，并且更新本地数据库，移动 origin/master 指针到更新之后的位置

![git fetch 更新你的远程跟踪分支](https://git-scm.com/book/en/v2/images/remote-branches-3.png)

为了演示有多个远程仓库与远程分支的情况，我们假定你有另一个内部 Git 服务器，仅服务于你的某个敏捷开发团队。这个服务器位于 git.team1.ourcompany.com。你可以运行 `git remote add` 命令添加一个新的远程仓库引用到当前的项目，这个命令我们会在[Git 基础](#git-基础)中详细说明。将这个远程仓库命名为 teamone，将其作为完整 URL 的缩写

![添加另一个远程仓库](https://git-scm.com/book/en/v2/images/remote-branches-4.png)

现在，可以运行 `git fetch teamone` 来抓取远程仓库 teamone 有而本地没有的数据。因为那台服务器上现有的数据是 origin 服务器上的一个子集，所以 Git 并不会抓取数据而是会设置远程跟踪分支 teamone/master 指向 teamone 的 master 分支

![远程跟踪分支 teamone/master](https://git-scm.com/book/en/v2/images/remote-branches-5.png)

#### 推送

当你想要公开分享一个分支时，需要将其推送到有写入权限的远程仓库上。本地的分支并不会自动与远程仓库同步 — 你必须显式地推送想要分享的分支。这样，你就可以把不愿意分享的内容放到私人分支上，而将需要和别人协作的内容推送到公开分支

如果希望和别人一起在名为 serverfix 的分支上工作，你可以像推送第一个分支那样推送它。运行 `git push <remote> <branch>`:

```text
$ git push origin serverfix
Counting objects: 24, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (15/15), done.
Writing objects: 100% (24/24), 1.91 KiB | 0 bytes/s, done.
Total 24 (delta 2), reused 0 (delta 0)
To https://github.com/schacon/simplegit
 * [new branch]      serverfix -> serverfix
```

这里有些工作被简化了 Git 自动将 serverfix 分支名字展开为 refs/heads/serverfix:refs/heads/serverfix，那意味着，“推送本地的 serverfix 分支来更新远程仓库上的 serverfix 分支。”我们将会详细学习 Git 内部原理 的 refs/heads/ 部分，但是现在可以先把它放在儿。你也可以运行 `git push origin serverfix:serverfix`，它会做同样的事 — 也就是说“推送本地的 serverfix 分支，将其作为远程仓库的 serverfix 分支”可以通过这种格式来推送本地分支到一个命名不相同的远程分支。如果并不想让远程仓库上的分支叫做 serverfix，可以运行 `git push origin serverfix:awesomebranch`来将本地的 serverfix 分支推送到远程仓库上的 awesomebranch 分支

下一次其他协作者从服务器上抓取数据时，他们会在本地生成一个远程分支 origin/serverfix，指向服务器的 serverfix 分支的引用：

```text
$ git fetch origin
remote: Counting objects: 7, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 3 (delta 0)
Unpacking objects: 100% (3/3), done.
From https://github.com/schacon/simplegit
 * [new branch]      serverfix    -> origin/serverfix
```

要特别注意的一点是当抓取到新的远程跟踪分支时，本地不会自动生成一份可编辑的副本（拷贝）。换一句话说，这种情况下，不会有一个新的 serverfix 分支 — 只有一个不可以修改的 origin/serverfix 指针

可以运行 `git merge origin/serverfix` 将这些工作合并到当前所在的分支。如果想要在自己的 serverfix 分支上工作，可以将其建立在远程跟踪分支之上：

```text
$ git checkout -b serverfix origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```

这会给你一个用于工作的本地分支，并且起点位于 origin/serverfix

#### 跟踪分支

从一个远程跟踪分支检出一个本地分支会自动创建所谓的“跟踪分支”（它跟踪的分支叫做“上游分支”）。 跟踪分支是与远程分支有直接关系的本地分支。如果在一个跟踪分支上输入 `git pull`，Git 能自动地识别去哪个服务器上抓取、合并到哪个分支

当克隆一个仓库时，它通常会自动地创建一个跟踪 origin/master 的 master 分支。然而，如果你愿意的话可以设置其他的跟踪分支，或是一个在其他远程仓库上的跟踪分支，又或者不跟踪 master 分支。最简单的实例就是像之前看到的那样，运行 `git checkout -b <branch> <remote>/<branch>`。这是一个十分常用的操作所以 Git 提供了 `--track` 快捷方式：

```text
$ git checkout --track origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```

由于这个操作太常用了，该捷径本身还有一个捷径。如果你尝试检出的分支 (a) 不存在且 (b) 刚好只有一个名字与之匹配的远程分支，那么 Git 就会为你创建一个跟踪分支：

```text
$ git checkout serverfix
Branch serverfix set up to track remote branch serverfix from origin.
Switched to a new branch 'serverfix'
```

如果想要将本地分支与远程分支设置为不同的名字，你可以轻松地使用上一个命令增加一个不同名字的本地分支：

```text
$ git checkout -b sf origin/serverfix
Branch sf set up to track remote branch serverfix from origin.
Switched to a new branch 'sf'
```

现在，本地分支 sf 会自动从 origin/serverfix 拉取

设置已有的本地分支跟踪一个刚刚拉取下来的远程分支，或者想要修改正在跟踪的上游分支，你可以在任意时间使用 `-u` 或 `--set-upstream-to` 选项运行 `git branch` 来显式地设置

```text
$ git branch -u origin/serverfix
Branch serverfix set up to track remote branch serverfix from origin.
```

上游快捷方式：当设置好跟踪分支后，可以通过简写 `@{upstream}` 或 `@{u}` 来引用它的上游分支。所以在 master 分支时并且它正在跟踪 origin/master 时，如果愿意的话可以使用 `git merge @{u}` 来取代 `git merge origin/master`

如果想要查看设置的所有跟踪分支，可以使用 `git branch` 的 `-vv` 选项。这会将所有的本地分支列出来并且包含更多的信息，如每一个分支正在跟踪哪个远程分支与本地分支是否是领先、落后或是都有

```text
$ git branch -vv
  iss53     7e424c3 [origin/iss53: ahead 2] forgot the brackets
  master    1ae2a45 [origin/master] deploying index fix
* serverfix f8674d9 [teamone/server-fix-good: ahead 3, behind 1] this should do it
  testing   5ea463a trying something new
```

这里可以看到 iss53 分支正在跟踪 origin/iss53 并且 “ahead” 是 2，意味着本地有两个提交还没有推送到服务器上。也能看到 master 分支正在跟踪 origin/master 分支并且是最新的。 接下来可以看到 serverfix 分支正在跟踪 teamone 服务器上的 server-fix-good 分支并且领先 3 落后 1，意味着服务器上有一次提交还没有合并入同时本地有三次提交还没有推送。最后看到 testing 分支并没有跟踪任何远程分支

需要重点注意的一点是这些数字的值来自于你从每个服务器上最后一次抓取的数据。这个命令并没有连接服务器，它只会告诉你关于本地缓存的服务器数据。如果想要统计最新的领先与落后数字，需要在运行此命令前抓取所有的远程仓库。可以像这样做：

```shell
$ git fetch --all; git branch -vv
```

#### 拉取

当 `git fetch`命令从服务器上抓取本地没有的数据时，它并不会修改工作目录中的内容。它只会获取数据然后让你自己合并。然而，有一个命令叫作 `git pull` 在大多数情况下它的含义是一个 `git fetch` 紧接着一个 `git merge` 命令。如果有一个像之前章节中演示的设置好的跟踪分支，不管它是显式地设置还是通过 `clone` 或 `checkout` 命令为你创建的，`git pull` 都会查找当前分支所跟踪的服务器与分支，从服务器上抓取数据然后尝试合并入那个远程分支

由于 `git pull` 的魔法经常令人困惑所以通常单独显式地使用 `fetch` 与 `merge` 命令会更好一些

#### 删除远程分支

假设你已经通过远程分支做完所有的工作了 — 也就是说你和你的协作者已经完成了一个特性，并且将其合并到了远程仓库的 master 分支（或任何其他稳定代码分支）。可以运行带有 `--delete` 选项的 `git push` 命令来删除一个远程分支。如果想要从服务器上删除 serverfix 分支，运行下面的命令：

```text
$ git push origin --delete serverfix
To https://github.com/schacon/simplegit
 - [deleted]         serverfix
```

基本上这个命令做的只是从服务器上移除这个指针。Git 服务器通常会保留数据一段时间直到垃圾回收运行，所以如果不小心删除掉了，通常是很容易恢复的

## 服务器上的 Git

### 协议

到目前为止，你应该已经有办法使用 Git 来完成日常工作。然而，为了使用 Git 协作功能，你还需要有远程的 Git 仓库。尽管在技术上你可以从个人仓库进行推送（push）和拉取（pull）来修改内容，但不鼓励使用这种方法，因为一不留心就很容易弄混其他人的进度。此外，你希望你的合作者们即使在你的电脑未联机时亦能存取仓库 — 拥有一个更可靠的公用仓库十分有用。因此，与他人合作的最佳方法即是建立一个你与合作者们都有权利访问，且可从那里推送和拉取资料的共用仓库

架设一台 Git 服务器并不难。首先，选择你希望服务器使用的通讯协议。在本章第一节将介绍可用的协议以及各自优缺点。下面一节将解释使用那些协议的典型设置及如何在你的服务器上运行。最后，如果你不介意托管你的代码在其他人的服务器，且不想经历设置与维护自己服务器的麻烦，可以试试我们介绍的几个仓库托管服务

如果你对架设自己的服务器没兴趣，可以跳到本章最后一节去看看如何申请一个代码托管服务的帐户然后继续下一章，我们会在那里讨论分布式源码控制环境的林林总总

一个远程仓库通常只是一个裸仓库（bare repository）— 即一个没有当前工作目录的仓库。因为该仓库仅仅作为合作媒介，不需要从磁盘检查快照；存放的只有 Git 的资料。简单的说，裸仓库就是你工程目录内的 .git 子目录内容，不包含其他资料

Git 可以使用四种不同的协议来传输资料：本地协议（Local），HTTP 协议，SSH（Secure Shell）协议及 Git 协议。在此，我们将会讨论那些协议及哪些情形应该使用（或避免使用）他们

#### 本地协议

最基本的就是 本地协议（Local protocol） ，其中的远程版本库就是同一主机上的另一个目录。这常见于团队每一个成员都对一个共享的文件系统（例如一个挂载的 NFS）拥有访问权，或者比较少见的多人共用同一台电脑的情况。后者并不理想，因为你的所有代码版本库如果长存于同一台电脑，更可能发生灾难性的损失

如果你使用共享文件系统，就可以从本地版本库克隆（clone）、推送（push）以及拉取（pull）。像这样去克隆一个版本库或者增加一个远程到现有的项目中，使用版本库路径作为 URL。例如，克隆一个本地版本库，可以执行如下的命令：

```shell
$ git clone /srv/git/project.git
```

或你可以执行这个命令：

```shell
$ git clone file:///srv/git/project.git
```

如果在 URL 开头明确的指定 file://，那么 Git 的行为会略有不同。如果仅是指定路径，Git 会尝试使用硬链接（hard link）或直接复制所需要的文件。如果指定 file://，Git 会触发平时用于网路传输资料的进程，那样传输效率会更低。 指定 file:// 的主要目的是取得一个没有外部参考（extraneous references）或对象（object）的干净版本库副本 — 通常是在从其他版本控制系统导入后或一些类似情况需要这么做（关于维护任务可参见 [Git 内部原理](#git-内部原理) ）。在此我们将使用普通路径，因为这样通常更快

要增加一个本地版本库到现有的 Git 项目，可以执行如下的命令：

```shell
$ git remote add local_proj /srv/git/project.git
```

然后，就可以通过新的远程仓库名 local_proj 像在网络上一样从远端版本库推送和拉取更新了

**优点**

基于文件系统的版本库的优点是简单，并且直接使用了现有的文件权限和网络访问权限。如果你的团队已经有共享文件系统，建立版本库会十分容易。 只需要像设置其他共享目录一样，把一个裸版本库的副本放到大家都可以访问的路径，并设置好读/写的权限，就可以了，我们会在 [在服务器上搭建 Git](#在服务器上搭建-git) 讨论如何导出一个裸版本库

这也是快速从别人的工作目录中拉取更新的方法。如果你和别人一起合作一个项目，他想让你从版本库中拉取更新时，运行类似 git pull /home/john/project 的命令比推送到服务器再抓取回来简单多了

**缺点**

这种方法的缺点是，通常共享文件系统比较难配置，并且比起基本的网络连接访问，这不方便从多个位置访问。如果你想从家里推送内容，必须先挂载一个远程磁盘，相比网络连接的访问方式，配置不方便，速度也慢

值得一提的是，如果你使用的是类似于共享挂载的文件系统时，这个方法不一定是最快的。访问本地版本库的速度与你访问数据的速度是一样的。在同一个服务器上，如果允许 Git 访问本地硬盘，一般的通过 NFS 访问版本库要比通过 SSH 访问慢

最终，这个协议并不保护仓库避免意外的损坏。每一个用户都有“远程”目录的完整 shell 权限，没有方法可以阻止他们修改或删除 Git 内部文件和损坏仓库

#### HTTP 协议

Git 通过 HTTP 通信有两种模式。在 Git 1.6.6 版本之前只有一个方式可用，十分简单并且通常是只读模式的。Git 1.6.6 版本引入了一种新的、更智能的协议，让 Git 可以像通过 SSH 那样智能的协商和传输数据。之后几年，这个新的 HTTP 协议因为其简单、智能变的十分流行。新版本的 HTTP 协议一般被称为 智能 HTTP 协议，旧版本的一般被称为 哑 HTTP 协议。我们先了解一下新的智能 HTTP 协议

**智能 HTTP 协议**

智能 HTTP 的运行方式和 SSH 及 Git 协议类似，只是运行在标准的 HTTP/S 端口上并且可以使用各种 HTTP 验证机制，这意味着使用起来会比 SSH 协议简单的多，比如可以使用 HTTP 协议的用户名/密码授权，免去设置 SSH 公钥

智能 HTTP 协议或许已经是最流行的使用 Git 的方式了，它即支持像 git:// 协议一样设置匿名服务，也可以像 SSH 协议一样提供传输时的授权和加密。而且只用一个 URL 就可以都做到，省去了为不同的需求设置不同的 URL。如果你要推送到一个需要授权的服务器上（一般来讲都需要），服务器会提示你输入用户名和密码。从服务器获取数据时也一样

事实上，类似 GitHub 的服务，你在网页上看到的 URL 比如 [https://github.com/schacon/simplegit](https://github.com/schacon/simplegit)，和你在克隆、推送（如果你有权限）时使用的是一样的

**哑（Dumb） HTTP 协议**

如果服务器没有提供智能 HTTP 协议的服务，Git 客户端会尝试使用更简单的“哑” HTTP 协议。哑 HTTP 协议里 web 服务器仅把裸版本库当作普通文件来对待，提供文件服务。哑 HTTP 协议的优美之处在于设置起来简单。基本上，只需要把一个裸版本库放在 HTTP 根目录，设置一个叫做 post-update 的挂钩就可以了（见 Git 钩子）。此时，只要能访问 web 服务器上你的版本库，就可以克隆你的版本库。下面是设置从 HTTP 访问版本库的方法：

```shell
$ cd /var/www/htdocs/
$ git clone --bare /path/to/git_project gitproject.git
$ cd gitproject.git
$ mv hooks/post-update.sample hooks/post-update
$ chmod a+x hooks/post-update
```

这样就可以了。Git 自带的 post-update 挂钩会默认执行合适的命令（git update-server-info），来确保通过 HTTP 的获取和克隆操作正常工作。这条命令会在你通过 SSH 向版本库推送之后被执行；然后别人就可以通过类似下面的命令来克隆：

```shell
$ git clone https://example.com/gitproject.git
```

这里我们用了 Apache 里设置了常用的路径 /var/www/htdocs，不过你可以使用任何静态 Web 服务器 — 只需要把裸版本库放到正确的目录下就可以。Git 的数据是以基本的静态文件形式提供的（详情见 [Git 内部原理](#git-内部原理)）

通常的，会在可以提供读／写的智能 HTTP 服务和简单的只读的哑 HTTP 服务之间选一个。 极少会将二者混合提供服务

**优点**

我们将只关注智能 HTTP 协议的优点。不同的访问方式只需要一个 URL 以及服务器只在需要授权时提示输入授权信息，这两个简便性让终端用户使用 Git 变得非常简单。相比 SSH 协议，可以使用用户名／密码授权是一个很大的优势，这样用户就不必须在使用 Git 之前先在本地生成 SSH 密钥对再把公钥上传到服务器。对非资深的使用者，或者系统上缺少 SSH 相关程序的使用者，HTTP 协议的可用性是主要的优势。与 SSH 协议类似，HTTP 协议也非常快和高效

你也可以在 HTTPS 协议上提供只读版本库的服务，如此你在传输数据的时候就可以加密数据；或者，你甚至可以让客户端使用指定的 SSL 证书

另一个好处是 HTTPS 协议被广泛使用，一般的企业防火墙都会允许这些端口的数据通过

**缺点**

在一些服务器上，架设 HTTPS 协议的服务端会比 SSH 协议的棘手一些。 除了这一点，用其他协议提供 Git 服务与智能 HTTP 协议相比就几乎没有优势了

如果你在 HTTP 上使用需授权的推送，管理凭证会比使用 SSH 密钥认证麻烦一些。然而，你可以选择使用凭证存储工具，比如 macOS 的 Keychain 或者 Windows 的凭证管理器。参考 [凭证存储](#凭证存储) 如何安全地保存 HTTP 密码

#### SSH 协议

架设 Git 服务器时常用 SSH 协议作为传输协议。因为大多数环境下服务器已经支持通过 SSH 访问 — 即使没有也很容易架设。SSH 协议也是一个验证授权的网络协议；并且，因为其普遍性，架设和使用都很容易

通过 SSH 协议克隆版本库，你可以指定一个 ssh:// 的 URL：

```shell
$ git clone ssh://[user@]server/project.git
```

或者使用一个简短的 scp 式的写法：

```shell
$ git clone [user@]server:project.git
```

在上面两种情况中，如果你不指定可选的用户名，那么 Git 会使用当前登录的用的名字

**优势**

用 SSH 协议的优势有很多。首先，SSH 架设相对简单 — SSH 守护进程很常见，多数管理员都有使用经验，并且多数操作系统都包含了它及相关的管理工具。其次，通过 SSH 访问是安全的 — 所有传输数据都要经过授权和加密。最后，与 HTTPS 协议、Git 协议及本地协议一样，SSH 协议很高效，在传输前也会尽量压缩数据

**缺点**

SSH 协议的缺点在于它不支持匿名访问 Git 仓库。如果你使用 SSH，那么即便只是读取数据，使用者也 必须 通过 SSH 访问你的主机，这使得 SSH 协议不利于开源的项目，毕竟人们可能只想把你的仓库克隆下来查看。如果你只在公司网络使用，SSH 协议可能是你唯一要用到的协议。如果你要同时提供匿名只读访问和 SSH 协议，那么你除了为自己推送架设 SSH 服务以外，还得架设一个可以让其他人访问的服务

#### Git 协议

最后是 Git 协议。这是包含在 Git 里的一个特殊的守护进程；它监听在一个特定的端口（9418），类似于 SSH 服务，但是访问无需任何授权。要让版本库支持 Git 协议，需要先创建一个 git-daemon-export-ok 文件 — 它是 Git 协议守护进程为这个版本库提供服务的必要条件 — 但是除此之外没有任何安全措施。要么谁都可以克隆这个版本库，要么谁也不能。 这意味着，通常不能通过 Git 协议推送。由于没有授权机制，一旦你开放推送操作，意味着网络上知道这个项目 URL 的人都可以向项目推送数据。不用说，极少会有人这么做

**优点**

目前，Git 协议是 Git 使用的网络传输协议里最快的。如果你的项目有很大的访问量，或者你的项目很庞大并且不需要为写进行用户授权，架设 Git 守护进程来提供服务是不错的选择。它使用与 SSH 相同的数据传输机制，但是省去了加密和授权的开销

**缺点**

Git 协议缺点是缺乏授权机制。把 Git 协议作为访问项目版本库的唯一手段是不可取的。一般的做法里，会同时提供 SSH 或者 HTTPS 协议的访问服务，只让少数几个开发者有推送（写）权限，其他人通过 git:// 访问只有读权限。Git 协议也许也是最难架设的。它要求有自己的守护进程，这就要配置 xinetd、systemd 或者其他的程序，这些工作并不简单。它还要求防火墙开放 9418 端口，但是企业防火墙一般不会开放这个非标准端口。而大型的企业防火墙通常会封锁这个端口

### 在服务器上搭建 Git

现在我们将讨论如何在你自己的服务器上搭建 Git 服务来运行这些协议

这里我们将要演示在 Linux 服务器上进行一次基本且简化的安装所需的命令与步骤，当然在 macOS 或 Windows 服务器上同样可以运行这些服务。事实上，在你的计算机基础架构中建立一个生产环境服务器，将不可避免的使用到不同的安全措施与操作系统工具。但是，希望你能从本节中获得一些必要的知识

在开始架设 Git 服务器前，需要把现有仓库导出为裸仓库 — 即一个不包含当前工作目录的仓库。这通常是很简单的。为了通过克隆你的仓库来创建一个新的裸仓库，你需要在克隆命令后加上 `--bare` 选项。 按照惯例，裸仓库的目录名以 .git 结尾，就像这样：

```text
$ git clone --bare my_project my_project.git
Cloning into bare repository 'my_project.git'...
done.
```

现在，你的 my_project.git 目录中应该有 Git 目录的副本了

整体上效果大致相当于

```shell
$ cp -Rf my_project/.git my_project.git
```

虽然在配置文件中有若干不同，但是对于你的目的来说，这两种方式都是一样的。它只取出 Git 仓库自身，不要工作目录，然后特别为它单独创建一个目录

#### 把裸仓库放到服务器上

既然你有了裸仓库的副本，剩下要做的就是把裸仓库放到服务器上并设置你的协议。假设一个域名为 git.example.com 的服务器已经架设好，并可以通过 SSH 连接，你想把所有的 Git 仓库放在 /srv/git 目录下。假设服务器上存在 /srv/git/ 目录，你可以通过以下命令复制你的裸仓库来创建一个新仓库：

```shell
$ scp -r my_project.git user@git.example.com:/srv/git
```

此时，其他可通过 SSH 读取此服务器上 /srv/git 目录的用户，可运行以下命令来克隆你的仓库

```shell
$ git clone user@git.example.com:/srv/git/my_project.git
```

如果一个用户，通过使用 SSH 连接到一个服务器，并且其对 /srv/git/my_project.git 目录拥有可写权限，那么他将自动拥有推送权限

如果到该项目目录中运行 `git init` 命令，并加上 `--shared` 选项，那么 Git 会自动修改该仓库目录的组权限为可写。注意，运行此命令的工程中不会摧毁任何提交、引用等内容

```shell
$ ssh user@git.example.com
$ cd /srv/git/my_project.git
$ git init --bare --shared
```

由此可见，根据现有的 Git 仓库创建一个裸仓库，然后把它放上你和协作者都有 SSH 访问权的服务器是多么容易。现在你们已经准备好在同一项目上展开合作了

值得注意的是，这的确是架设一个几个人拥有连接权的 Git 服务的全部 — 只要在服务器上加入可以用 SSH 登录的帐号，然后把裸仓库放在大家都有读写权限的地方。你已经准备好了一切，无需更多

下面的几节中，你会了解如何扩展到更复杂的设定。这些内容包含如何避免为每一个用户建立一个账户，给仓库添加公共读取权限，架设网页界面等等。然而，请记住这一点，如果只是和几个人在一个私有项目上合作的话，仅仅 是一个 SSH 服务器和裸仓库就足够了

#### 小型安装

如果设备较少或者你只想在小型开发团队里尝试 Git ，那么一切都很简单。架设 Git 服务最复杂的地方在于用户管理。如果需要仓库对特定的用户可读，而给另一部分用户读写权限，那么访问和许可安排就会比较困难

#### SSH 连接

如果你有一台所有开发者都可以用 SSH 连接的服务器，架设你的第一个仓库就十分简单了，因为你几乎什么都不用做（正如我们上一节所说的）。如果你想在你的仓库上设置更复杂的访问控制权限，只要使用服务器操作系统的普通的文件系统权限就行了

如果需要团队里的每个人都对仓库有写权限，又不能给每个人在服务器上建立账户，那么提供 SSH 连接就是唯一的选择了。我们假设用来共享仓库的服务器已经安装了 SSH 服务，而且你通过它访问服务器

有几个方法可以使你给团队每个成员提供访问权。第一个就是给团队里的每个人创建账号，这种方法很直接但也很麻烦。或许你不会想要为每个人运行一次 adduser（或者 useradd）并且设置临时密码

第二个办法是在主机上建立一个 'git' 账户，让每个需要写权限的人发送一个 SSH 公钥，然后将其加入 git 账户的 ~/.ssh/authorized_keys 文件。这样一来，所有人都将通过 'git' 账户访问主机。这一点也不会影响提交的数据 — 访问主机用的身份不会影响提交对象的提交者信息

另一个办法是让 SSH 服务器通过某个 LDAP 服务，或者其他已经设定好的集中授权机制，来进行授权。只要每个用户可以获得主机的 shell 访问权限，任何 SSH 授权机制你都可视为是有效的

### 生成 SSH 公钥

如前所述，许多 Git 服务器都使用 SSH 公钥进行认证。为了向 Git 服务器提供 SSH 公钥，如果某系统用户尚未拥有密钥，必须事先为其生成一份。这个过程在所有操作系统上都是相似的。首先，你需要确认自己是否已经拥有密钥。默认情况下，用户的 SSH 密钥存储在其 ~/.ssh 目录下。进入该目录并列出其中内容，你便可以快速确认自己是否已拥有密钥：

```text
$ cd ~/.ssh
$ ls
authorized_keys2  id_dsa       known_hosts
config            id_dsa.pub
```

我们需要寻找一对以 id_dsa 或 id_rsa 命名的文件，其中一个带有 .pub 扩展名。 .pub 文件是你的公钥，另一个则是与之对应的私钥。如果找不到这样的文件（或者根本没有 .ssh 目录），你可以通过运行 ssh-keygen 程序来创建它们。在 Linux/macOS 系统中，ssh-keygen 随 SSH 软件包提供；在 Windows 上，该程序包含于 MSysGit 软件包中

```text
$ ssh-keygen -o
Generating public/private rsa key pair.
Enter file in which to save the key (/home/schacon/.ssh/id_rsa):
Created directory '/home/schacon/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/schacon/.ssh/id_rsa.
Your public key has been saved in /home/schacon/.ssh/id_rsa.pub.
The key fingerprint is:
d0:82:24:8e:d7:f1:bb:9b:33:53:96:93:49:da:9b:e3 schacon@mylaptop.local
```

首先 ssh-keygen 会确认密钥的存储位置（默认是 .ssh/id_rsa），然后它会要求你输入两次密钥口令。如果你不想在使用密钥时输入口令，将其留空即可。然而，如果你使用了密码，那么请确保添加了 `-o` 选项，它会以比默认格式更能抗暴力破解的格式保存私钥。你也可以用 ssh-agent 工具来避免每次都要输入密码

现在，进行了上述操作的用户需要将各自的公钥发送给任意一个 Git 服务器管理员 （假设服务器正在使用基于公钥的 SSH 验证设置）。他们所要做的就是复制各自的 .pub 文件内容，并将其通过邮件发送。公钥看起来是这样的：

```text
$ cat ~/.ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU
GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3
Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA
t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En
mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx
NrRFi9wrf+M7Q== schacon@mylaptop.local
```

关于在多种操作系统中生成 SSH 密钥的更深入教程，请参阅 GitHub 的 SSH 密钥指南 [https://docs.github.com/cn/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent](https://docs.github.com/cn/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

### 配置服务器

我们来看看如何配置服务器端的 SSH 访问。本例中，我们将使用 authorized_keys 方法来对用户进行认证。同时我们假设你使用的操作系统是标准的 Linux 发行版，比如 Ubuntu。首先，创建一个操作系统用户 git，并为其建立一个 .ssh 目录

以下操作可通过 ssh-copy-id 命令自动完成，这样就不必手动复制并安装公钥了

首先，创建一个操作系统用户 git，并为其建立一个 .ssh 目录

```shell
$ sudo adduser git
$ su git
$ cd
$ mkdir .ssh && chmod 700 .ssh
$ touch .ssh/authorized_keys && chmod 600 .ssh/authorized_keys
```

接着，我们需要为系统用户 git 的 authorized_keys 文件添加一些开发者 SSH 公钥。假设我们已经获得了若干受信任的公钥，并将它们保存在临时文件中。与前文类似，这些公钥看起来是这样的：

```text
$ cat /tmp/id_rsa.john.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4L
ojG6rs6hPB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4k
Yjh6541NYsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9Ez
Sdfd8AcCIicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myiv
O7TCUSBdLQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPq
dAv8JggJICUvax2T9va5 gsg-keypair
```

将这些公钥加入系统用户 git 的 .ssh 目录下 authorized_keys 文件的末尾：

```shell
$ cat /tmp/id_rsa.john.pub >> ~/.ssh/authorized_keys
$ cat /tmp/id_rsa.josie.pub >> ~/.ssh/authorized_keys
$ cat /tmp/id_rsa.jessica.pub >> ~/.ssh/authorized_keys
```

现在我们来为开发者新建一个空仓库。可以借助带 `--bare` 选项的 `git init` 命令来做到这一点，该命令在初始化仓库时不会创建工作目录：

```shell
$ cd /srv/git
$ mkdir project.git
$ cd project.git
$ git init --bare
Initialized empty Git repository in /srv/git/project.git/
```

接着，John、Josie 或者 Jessica 中的任意一人可以将他们项目的最初版本推送到这个仓库中，他只需将此仓库设置为项目的远程仓库并向其推送分支。请注意，每添加一个新项目，都需要有人登录服务器取得 shell，并创建一个裸仓库。我们假定这个设置了 git 用户和 Git 仓库的服务器使用 gitserver 作为主机名。同时，假设该服务器运行在内网，并且你已在 DNS 配置中将 gitserver 指向此服务器。那么我们可以运行如下命令（假定 myproject 是已有项目且其中已包含文件）：

```shell
# on John's computer
$ cd myproject
$ git init
$ git add .
$ git commit -m 'initial commit'
$ git remote add origin git@gitserver:/srv/git/project.git
$ git push origin master
```

此时，其他开发者可以克隆此仓库，并推回各自的改动，步骤很简单：

```shell
$ git clone git@gitserver:/srv/git/project.git
$ cd project
$ vim README
$ git commit -am 'fix for the README file'
$ git push origin master
```

通过这种方法，你可以快速搭建一个具有读写权限、面向多个开发者的 Git 服务器

需要注意的是，目前所有（获得授权的）开发者用户都能以系统用户 git 的身份登录服务器从而获得一个普通 shell。如果你想对此加以限制，则需要修改 /etc/passwd 文件中（git 用户所对应）的 shell 值

借助一个名为 git-shell 的受限 shell 工具，你可以方便地将用户 git 的活动限制在与 Git 相关的范围内。该工具随 Git 软件包一同提供。如果将 git-shell 设置为用户 git 的登录 shell（login shell），那么该用户便不能获得此服务器的普通 shell 访问权限。若要使用 git-shell，需要用它替换掉 bash 或 csh，使其成为该用户的登录 shell。为进行上述操作，首先你必须确保 git-shell 的完整路径名已存在于 /etc/shells 文件中：

```shell
$ cat /etc/shells   # see if git-shell is already in there. If not...
$ which git-shell   # make sure git-shell is installed on your system.
$ sudo -e /etc/shells  # and add the path to git-shell from last command
```

现在你可以使用 `chsh <username> -s <shell>` 命令修改任一系统用户的 shell：

```shell
$ sudo chsh git -s $(which git-shell)
```

这样，用户 git 就只能利用 SSH 连接对 Git 仓库进行推送和拉取操作，而不能登录机器并取得普通 shell。如果试图登录，你会发现尝试被拒绝，像这样：

```text
$ ssh git@gitserver
fatal: Interactive git shell is not enabled.
hint: ~/git-shell-commands should exist and have read and execute access.
Connection to gitserver closed.
```

此时，用户仍可通过 SSH 端口转发来访问任何可达的 git 服务器。如果你想要避免它，可编辑 authorized_keys 文件并在所有想要限制的公钥之前添加以下选项：

```text
no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty
```

其结果如下：

```text
$ cat ~/.ssh/authorized_keys
no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-rsa
AAAAB3NzaC1yc2EAAAADAQABAAABAQCB007n/ww+ouN4gSLKssMxXnBOvf9LGt4LojG6rs6h
PB09j9R/T17/x4lhJA0F3FR1rP6kYBRsWj2aThGw6HXLm9/5zytK6Ztg3RPKK+4kYjh6541N
YsnEAZuXz0jTTyAUfrtU3Z5E003C4oxOj6H0rfIF1kKI9MAQLMdpGW1GYEIgS9EzSdfd8AcC
IicTDWbqLAcU4UpkaX8KyGlLwsNuuGztobF8m72ALC/nLF6JLtPofwFBlgc+myivO7TCUSBd
LQlgMVOFq1I2uPWQOkOWQAHukEOmfjy2jctxSDBQ220ymjaNsHT4kgtZg2AYYgPqdAv8JggJ
ICUvax2T9va5 gsg-keypair

no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-rsa
AAAAB3NzaC1yc2EAAAADAQABAAABAQDEwENNMomTboYI+LJieaAY16qiXiH3wuvENhBG...
```

现在，网络相关的 Git 命令依然能够正常工作，但是开发者用户已经无法得到一个普通 shell 了。正如输出信息所提示的，你也可以在 git 用户的主目录下建立一个目录，来对 git-shell 命令进行一定程度的自定义。比如，你可以限制掉某些本应被服务器接受的 Git 命令，或者对刚才的 SSH 拒绝登录信息进行自定义，这样，当有开发者用户以类似方式尝试登录时，便会看到你的信息。要了解更多有关自定义 shell 的信息，请运行 `git help shell`

### Git 守护进程

接下来我们将通过 “Git” 协议建立一个基于守护进程的仓库。对于快速且无需授权的 Git 数据访问，这是一个理想之选。请注意，因为其不包含授权服务，任何通过该协议管理的内容将在其网络上公开

如果运行在防火墙之外的服务器上，它应该只对那些公开的只读项目服务。如果运行在防火墙之内的服务器上，它可用于支撑大量参与人员或自动系统 （用于持续集成或编译的主机）只读访问的项目，这样可以省去逐一配置 SSH 公钥的麻烦

无论何时，该 Git 协议都是相对容易设定的。通常，你只需要以守护进程的形式运行该命令：

```shell
$ git daemon --reuseaddr --base-path=/srv/git/ /srv/git/
```

`--reuseaddr` 选项允许服务器在无需等待旧连接超时的情况下重启，而 `--base-path` 选项允许用户在未完全指定路径的条件下克隆项目，结尾的路径将告诉 Git 守护进程从何处寻找仓库来导出。如果有防火墙正在运行，你需要开放端口 9418 的通信权限

你可以通过许多方式将该进程以守护进程的方式运行，这主要取决于你所使用的操作系统

由于在现代的 Linux 发行版中，systemd 是最常见的初始化系统，因此你可以用它来达到此目的。只要在 /etc/systemd/system/git-daemon.service 中放一个文件即可，其内容如下：

```text
[Unit]
Description=Start Git Daemon

[Service]
ExecStart=/usr/bin/git daemon --reuseaddr --base-path=/srv/git/ /srv/git/

Restart=always
RestartSec=500ms

StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=git-daemon

User=git
Group=git

[Install]
WantedBy=multi-user.target
```

你可能会注意这里以 git 启动的 Git 驻留程序同时使用了 Group 和 User 权限。按需修改它并确保提供的用户在此系统上。此外，请确保 Git 二进制文件位于 /usr/bin/git，必要时可修改此路径

最后，你需要运行 `systemctl enable git-daemon` 以让它在系统启动时自动运行，这样也能让它通过 `systemctl start git-daemon` 启动，通过 `systemctl stop git-daemon` 停止

在其他系统中，你可以使用 sysvinit 系统中的 xinetd 脚本，或者另外的方式来实现 — 只要你能够将其命令守护进程化并实现监控

接下来，你需要告诉 Git 哪些仓库允许基于服务器的无授权访问。你可以在每个仓库下创建一个名为 git-daemon-export-ok 的文件来实现

```shell
$ cd /path/to/project.git
$ touch git-daemon-export-ok
```

该文件将允许 Git 提供无需授权的项目访问服务

### Smart HTTP

我们一般通过 SSH 进行授权访问，通过 git:// 进行无授权访问，但是还有一种协议可以同时实现以上两种方式的访问。设置 Smart HTTP 一般只需要在服务器上启用一个 Git 自带的名为 git-http-backend 的 CGI 脚本。该 CGI 脚本将会读取由 `git fetch` 或 `git push` 命令向 HTTP URL 发送的请求路径和头部信息，来判断该客户端是否支持 HTTP 通信（不低于 1.6.6 版本的客户端支持此特性）。如果 CGI 发现该客户端支持智能（Smart）模式，它将会以智能模式与它进行通信，否则它将会回落到哑（Dumb）模式下（因此它可以对某些老的客户端实现向下兼容）。

在完成以上简单的安装步骤后，我们将用 Apache 来作为 CGI 服务器。如果你没有安装 Apache，你可以在 Linux 环境下执行如下或类似的命令来安装：

```shell
$ sudo apt-get install apache2 apache2-utils
$ a2enmod cgi alias env
```

该操作将会启用 mod_cgi， mod_alias 和 mod_env 等 Apache 模块， 这些模块都是使该功能正常工作所必须的

你还需要将 /srv/git 的 Unix 用户组设置为 www-data，这样 Web 服务器才能读写该仓库，因为运行 CGI 脚本的 Apache 实例默认会以该用户的权限运行：

```shell
$ chgrp -R www-data /srv/git
```

接下来我们要向 Apache 配置文件添加一些内容，来让 git-http-backend 作为 Web 服务器对 /git 路径请求的处理器

```text
SetEnv GIT_PROJECT_ROOT /srv/git
SetEnv GIT_HTTP_EXPORT_ALL
ScriptAlias /git/ /usr/lib/git-core/git-http-backend/
```

如果留空 GIT_HTTP_EXPORT_ALL 这个环境变量，Git 将只对无授权客户端提供带 git-daemon-export-ok 文件的版本库，就像 Git 守护进程一样

最后，如果想让 Apache 允许 git-http-backend 请求并实现写入操作的授权验证，使用如下授权屏蔽配置即可：

```text
<Files "git-http-backend">
    AuthType Basic
    AuthName "Git Access"
    AuthUserFile /srv/git/.htpasswd
    Require expr !(%{QUERY_STRING} -strmatch '*service=git-receive-pack*' || %{REQUEST_URI} =~ m#/git-receive-pack$#)
    Require valid-user
</Files>
```

这需要你创建一个包含所有合法用户密码的 .htpasswd 文件。以下是一个添加 “schacon” 用户到此文件的例子：

```shell
$ htpasswd -c /srv/git/.htpasswd schacon
```

你可以通过许多方式添加 Apache 授权用户，选择使用其中一种方式即可。以上仅仅只是我们可以找到的最简单的一个例子。如果愿意的话，你也可以通过 SSL 运行它，以保证所有数据是在加密状态下进行传输的

我们不想深入去讲解 Apache 配置文件，因为你可能会使用不同的 Web 服务器，或者可能有不同的授权需求。它的主要原理是使用一个 Git 附带的，名为 git-http-backend 的 CGI。它被引用来处理协商通过 HTTP 发送和接收的数据。它本身并不包含任何授权功能，但是授权功能可以在 Web 服务器层引用它时被轻松实现。你可以在任何所有可以处理 CGI 的 Web 服务器上办到这点，所以随便挑一个你最熟悉的 Web 服务器试手吧

欲了解更多的有关配置 Apache 授权访问的信息，请通过以下链接浏览 Apache 文档：[https://httpd.apache.org/docs/current/howto/auth.html](https://httpd.apache.org/docs/current/howto/auth.html)

### GitWeb

如果你对项目有读写权限或只读权限，你可能需要建立起一个基于网页的简易查看器。Git 提供了一个叫做 GitWeb 的 CGI 脚本来做这项工作

![GitWeb 的网页用户界面](https://git-scm.com/book/en/v2/images/git-instaweb.png)

如果你想要查看 GitWeb 如何展示你的项目，并且在服务器上安装了轻量级 Web 服务器比如 lighttpd 或 webrick，Git 提供了一个命令来让你启动一个临时的服务器。在 Linux 系统的电脑上，lighttpd 通常已经安装了，所以你只需要在项目目录里执行 git instaweb 命令即可。如果你使用 Mac 系统，Mac OS X Leopard 系统已经预安装了 Ruby，所以 webrick 或许是你最好的选择。如果不想使用 lighttpd 启动 instaweb 命令，你需要在执行时加入 --httpd 参数

```text
$ git instaweb --httpd=webrick
[2009-02-21 10:02:21] INFO  WEBrick 1.3.1
[2009-02-21 10:02:21] INFO  ruby 1.8.6 (2008-03-03) [universal-darwin9.0]
```

这个命令启动了一个监听 1234 端口的 HTTP 服务器，并且自动打开了浏览器。这对你来说十分方便。当你已经完成了工作并想关闭这个服务器，你可以执行同一个命令，并加上 `--stop` 选项：

```shell
$ git instaweb --httpd=webrick --stop
```

如果你现在想为你的团队或你托管的开源项目持续的运行这个页面，你需要通过普通的 Web 服务器来设置 CGI 脚本。一些 Linux 发行版的软件库有 gitweb 包，可以通过 `apt` 或 `dnf` 来安装，你可以先试试。接下来我们来快速的了解一下如何手动安装 GitWeb。首先，你需要获得 Git 的源代码，它包含了 GitWeb ，并可以生成自定义的 CGI 脚本：

```text
$ git clone git://git.kernel.org/pub/scm/git/git.git
$ cd git/
$ make GITWEB_PROJECTROOT="/srv/git" prefix=/usr gitweb
    SUBDIR gitweb
    SUBDIR ../
make[2]: `GIT-VERSION-FILE' is up to date.
    GEN gitweb.cgi
    GEN static/gitweb.js
$ sudo cp -Rf gitweb /var/www/
```

需要注意的是，你需要在命令中指定 GITWEB_PROJECTROOT 变量来让程序知道你的 Git 版本库的位置。现在，你需要在 Apache 中使用这个 CGI 脚本，你需要为此添加一个虚拟主机：

```text
<VirtualHost *:80>
    ServerName gitserver
    DocumentRoot /var/www/gitweb
    <Directory /var/www/gitweb>
        Options +ExecCGI +FollowSymLinks +SymLinksIfOwnerMatch
        AllowOverride All
        order allow,deny
        Allow from all
        AddHandler cgi-script cgi
        DirectoryIndex gitweb.cgi
    </Directory>
</VirtualHost>
```

再次提醒，GitWeb 可以通过任何一个支持 CGI 或 Perl 的网络服务器架设；如果你需要的话，架设起来应该不会很困难。现在，你可以访问 [http://gitserver/](http://gitserver/) 在线查看你的版本库

### GitLab

虽然 GitWeb 相当简单。 但如果你正在寻找一个更现代，功能更全的 Git 服务器，这里有几个开源的解决方案可供你选择安装。因为 GitLab 是其中最出名的一个，我们将它作为示例并讨论它的安装和使用。这比 GitWeb 要复杂的多并且需要更多的维护，但它的确是一个功能更全的选择

#### 安装

GitLab 是一个数据库支持的 web 应用，所以相比于其他 git 服务器，它的安装过程涉及到更多的东西。幸运的是，这个过程有非常详细的文档说明和支持

这里有一些可参考的方法帮你安装 GitLab 。为了更快速的启动和运行，你可以下载虚拟机镜像或者在 [https://bitnami.com/stack/gitlab](https://bitnami.com/stack/gitlab) 上获取一键安装包，同时调整配置使之符合你特定的环境。Bitnami 的一个优点在于它的登录界面（通过 alt+→ 键进入），它会告诉你安装好的 GitLab 的 IP 地址以及默认的用户名和密码

![Bitnami GitLab 虚拟机登录界面](https://git-scm.com/book/en/v2/images/bitnami.png)

无论如何，跟着 GitLab 社区版的 readme 文件一步步来，你可以在这里找到它 [https://gitlab.com/gitlab-org/gitlab-ce/tree/master](https://gitlab.com/gitlab-org/gitlab-ce/tree/master) 。在这里你将会在主菜单中找到安装 GitLab 的帮助，一个可以在 Digital Ocean 上运行的虚拟机，以及 RPM 和 DEB 包（都是测试版）。这里还有 “非官方” 的引导让 GitLab 运行在非标准的操作系统和数据库上，一个全手动的安装脚本，以及许多其他的话题

GitLab 官网：[https://gitlab.com](https://gitlab.com)

gitlab-ce：社区版，免费，中小型企业

gitlab-ee：企业版，收费，功能相对较多

下载参考：[ 清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/)

**安装依赖包**

```shell
sudo yum install -y curl policycoreutils-python openssh-server
```

说明 本教程中示例场景的操作系统为 CentOs 7.2 64 位。如果您使用 CentOs 8 系统的 ECS 实例，运行以上命令将出现找不到依赖包 policycoreutils-python 的问题，原因是 CentOS 8 的软件源中没有包含该依赖包。该依赖包不影响部署 GitLab，您可以忽略该问题继续运行下文中的命令

**安装步骤如下**

1. 执行以下命令，使用官方脚本添加 yum 源

    ```shell
    curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | bash
    ```

2. 执行以下命令，安装 GitLab

    ```shell
    yum install -y gitlab-ee
    ```

3. 执行以下命令，初始化已经安装好的 GitLab 说明：此过程将耗时3分钟左右，请耐心等待

    ```shell
    gitlab-ctl reconfigure
    ```

4. 执行以下命令，启动 GitLab

    ```shell
    gitlab-ctl start
    ```

5. 查看启动日志

    ```shell
    gitlab-ctl tail
    ```

6. 访问 GitLab，GitLab 的访问地址是 external_url 配置的地址，所以直接访问 http://${ip}（需要确保云服务商中的安全组已开放 80 端口）

7. 设置管理员用户密码

    默认管理员用户为 root，所以只需要设置 root 用户的密码即可。GitLab 安装初始化后，默认账户是 root，密码存放在配置文件里，执行以下命令查看：
    
    ```shell
    cat /etc/gitlab/initial_root_password
    ```

**常用命令**

```shell
gitlab-ctl start # 启动所有 GitLab 组件
gitlab-ctl stop # 停止所有 GitLab 组件
gitlab-ctl restart # 重启所有 GitLab 组件
gitlab-ctl status # 查看 GitLab 服务状态
gitlab-ctl tail # 查看 GitLab 所有日志
gitlab-ctl reconfigure # 如果更改了主配置文件 /etc/gitlab/gitlab.rb 需要使用该命令，使配置文件生效；但是会初始化除了 gitlab.rb 之外的所有文件
```

#### 管理

GitLab 的管理界面是通过网络进入的。将你的浏览器转到已经安装 GitLab 的 主机名或 IP 地址，然后以管理员身份登录即可。默认的用户名是 admin@local.host，默认的密码是 5iveL!fe（你会得到类似 请登录后尽快更换密码 的提示）。登录后，点击主栏上方靠右位置的 “Admin area” 图标进行管理

![GitLab 主栏的 “Admin area” 图标](https://git-scm.com/book/en/v2/images/gitlab-menu.png)

#### 使用者

GitLab 上的用户指的是对应协作者的帐号。用户帐号没有很多复杂的地方，主要是包含登录数据的用户信息集合。每一个用户账号都有一个 命名空间 ，即该用户项目的逻辑集合。如果一个叫 jane 的用户拥有一个名称是 project 的项目，那么这个项目的 url 会是 [http://server/jane/project](http://server/jane/project)

![GitLab 用户管理界面](https://git-scm.com/book/en/v2/images/gitlab-users.png)

移除一个用户有两种方法。 “屏蔽（Blocking）” 一个用户阻止他登录 GitLab 实例，但是该用户命名空间下的所有数据仍然会被保存，并且仍可以通过该用户提交对应的登录邮箱链接回他的个人信息页

而另一方面，“销毁（Destroying）” 一个用户，会彻底的将他从数据库和文件系统中移除。他命名空间下的所有项目和数据都会被删除，拥有的任何组也会被移除。这显然是一个更永久且更具破坏力的行为，所以很少用到这种方法

#### 组

一个 GitLab 的组是一些项目的集合，连同关于多少用户可以访问这些项目的数据。每一个组都有一个项目命名空间（与用户一样），所以如果一个叫 training 的组拥有一个名称是 materials 的项目，那么这个项目的 url 会是 [http://server/training/materials](http://server/training/materials)

![GitLab 组管理界面](https://git-scm.com/book/en/v2/images/gitlab-groups.png)

每一个组都有许多用户与之关联，每一个用户对组中的项目以及组本身的权限都有级别区分。权限的范围从 “访客”（仅能提问题和讨论） 到 “拥有者”（完全控制组、成员和项目）。权限的种类太多以至于难以在这里一一列举，不过在 GitLab 的管理界面上有帮助链接

#### 项目

一个 GitLab 的项目相当于 git 的版本库。每一个项目都属于一个用户或者一个组的单个命名空间。如果这个项目属于一个用户，那么这个拥有者对所有可以获取这个项目的人拥有直接管理权；如果这个项目属于一个组，那么该组中用户级别的权限也会起作用

每一个项目都有一个可视级别，控制着谁可以看到这个项目页面和仓库。 如果一个项目是 私有 的，这个项目的拥有者必须明确授权从而使特定的用户可以访问。一个 内部 的项目可以被所有登录的人看到，而一个 公开 的项目则是对所有人可见的。注意，这种控制既包括 `git fetch` 的使用也包括对项目 web 用户界面的访问

#### 钩子

GitLab 在项目和系统级别上都支持钩子程序。对任意级别，当有相关事件发生时，GitLab 的服务器会执行一个包含描述性 JSON 数据的 HTTP 请求。这是自动化连接你的 git 版本库和 GitLab 实例到其他的开发工具，比如 CI 服务器，聊天室，或者部署工具的一个极好方法

#### 基本用途

你想要在 GitLab 做的第一件事就是建立一个新项目。这通过点击工具栏上的 “+” 图标完成。你需要填写项目名称，项目所属命名空间，以及它的可视层级。绝大多数的设定并不是永久的，可以通过设置界面重新调整。点击 “Create Project”，你就完成了

项目存在后，你可能会想将它与本地的 Git 版本库连接。每一个项目都可以通过 HTTPS 或者 SSH 连接，任意两者都可以被用来配置远程 Git。在项目主页的顶栏可以看到这个项目的 URL。对于一个存在的本地版本库，这个命令将会向主机位置添加一个叫 gitlab 的远程仓库：

```shell
$ git remote add gitlab https://server/namespace/project.git
```

如果你的本地没有版本库的副本，你可以这样做：

```shell
$ git clone https://server/namespace/project.git
```

web 用户界面提供了几个有用的获取版本库信息的网页。每一个项目的主页都显示了最近的活动，并且通过顶部的链接可以使你浏览项目文件以及提交日志

#### 一起工作

在一个 GitLab 项目上一起工作的最简单方法就是赋予协作者对 git 版本库的直接 push 权限。你可以通过项目设定的 “Members（成员）” 部分向一个项目添加协作者，并且将这个新的协作者与一个访问级别关联（不同的访问级别在 [组](#组) 中已简单讨论）。通过赋予一个协作者 “Developer（开发者）” 或者更高的访问级别，这个用户就可以毫无约束地直接向版本库或者向分支进行提交

另外一个让合作更解耦的方法就是使用合并请求。它的优点在于让任何能够看到这个项目的协作者在被管控的情况下对这个项目作出贡献。可以直接访问的协作者能够简单的创建一个分支，向这个分支进行提交，也可以开启一个向 master 或者其他任何一个分支的合并请求。对版本库没有推送权限的协作者则可以 “fork” 这个版本库（即创建属于自己的这个库的副本），向那个副本进行提交，然后从那个副本开启一个到主项目的合并请求。这个模型使得项目拥有者完全控制着向版本库的提交，以及什么时候允许加入陌生协作者的贡献

在 GitLab 中合并请求和问题是一个长久讨论的主要部分。每一个合并请求都允许在提出改变的行进行讨论（它支持一个轻量级的代码审查），也允许对一个总体性话题进行讨论。两者都可以被分配给用户，或者组织到 milestones（里程碑） 界面

这个部分主要聚焦于在 GitLab 中与 Git 相关的特性，但是 GitLab 作为一个成熟的系统，它提供了许多其他产品来帮助你协同工作，例如项目 wiki 与系统维护工具。 GitLab 的一个优点在于，服务器设置和运行以后，你将很少需要调整配置文件或通过 SSH 连接服务器。绝大多数的管理和日常使用都可以在浏览器界面中完成

### 第三方托管的选择

如果不想设立自己的 Git 服务器，你可以选择将你的 Git 项目托管到一个外部专业的托管网站。这带来了一些好处：一个托管网站可以用来快速建立并开始项目，且无需进行服务器维护和监控工作。即使你在内部设立并且运行了自己的服务器，你仍然可以把你的开源代码托管在公共托管网站——这通常更有助于开源社区来发现和帮助你

现在，有非常多的托管供你选择，每个选择都有不同的优缺点。欲查看最新列表，请浏览 Git 维基的 GitHosting 页面 [https://git.wiki.kernel.org/index.php/GitHosting](https://git.wiki.kernel.org/index.php/GitHosting)

我们会在 [GitHub](#github) 详细讲解 GitHub，作为目前最大的 Git 托管平台，你很可能需要与托管在 GitHub 上的项目进行交互，而且你也很可能并不想去设立你自己的 Git 服务器

## 分布式 Git

### 分布式工作流程

你现在拥有了一个远程 Git 版本库，能为所有开发者共享代码提供服务，在一个本地工作流程下，你也已经熟悉了基本 Git 命令。你现在可以学习如何利用 Git 提供的一些分布式工作流程了

这一章中，你将会学习如何作为贡献者或整合者，在一个分布式协作的环境中使用 Git。你会学习为一个项目成功地贡献代码，并接触一些最佳实践方式，让你和项目的维护者能轻松地完成这个过程。另外，你也会学到如何管理有很多开发者提交贡献的项目

与传统的集中式版本控制系统（CVCS）相反，Git 的分布式特性使得开发者间的协作变得更加灵活多样。在集中式系统中，每个开发者就像是连接在集线器上的节点，彼此的工作方式大体相像。而在 Git 中，每个开发者同时扮演着节点和集线器的角色 — 也就是说，每个开发者既可以将自己的代码贡献到其他的仓库中，同时也能维护自己的公开仓库，让其他人可以在其基础上工作并贡献代码。由此，Git 的分布式协作可以为你的项目和团队衍生出种种不同的工作流程，接下来的章节会介绍几种利用了 Git 的这种灵活性的常见应用方式。我们将讨论每种方式的优点以及可能的缺点；你可以选择使用其中的某一种，或者将它们的特性混合搭配使用

#### 集中式工作流

集中式系统中通常使用的是单点协作模型 — 集中式工作流。一个中心集线器，或者说仓库，可以接受代码，所有人将自己的工作与之同步。若干个开发者则作为节点，即中心仓库的消费者与中心仓库同步

![集中式工作流](https://git-scm.com/book/en/v2/images/centralized_workflow.png)

这意味着如果两个开发者从中心仓库克隆代码下来，同时作了一些修改，那么只有第一个开发者可以顺利地把数据推送回共享服务器。第二个开发者在推送修改之前，必须先将第一个人的工作合并进来，这样才不会覆盖第一个人的修改。这和 Subversion （或任何 CVCS）中的概念一样，而且这个模式也可以很好地运用到 Git 中

如果在公司或者团队中，你已经习惯了使用这种集中式工作流程，完全可以继续采用这种简单的模式。只需要搭建好一个中心仓库，并给开发团队中的每个人推送数据的权限，就可以开展工作了。Git 不会让用户覆盖彼此的修改

例如 John 和 Jessica 同时开始工作。John 完成了他的修改并推送到服务器。接着 Jessica 尝试提交她自己的修改，却遭到服务器拒绝。她被告知她的修改正通过非快进式（non-fast-forward）的方式推送，只有将数据抓取下来并且合并后方能推送。这种模式的工作流程的使用非常广泛，因为大多数人对其很熟悉也很习惯

当然这并不局限于小团队。利用 Git 的分支模型，通过同时在多个分支上工作的方式，即使是上百人的开发团队也可以很好地在单个项目上协作

#### 集成管理者工作流

Git 允许多个远程仓库存在，使得这样一种工作流成为可能：每个开发者拥有自己仓库的写权限和其他所有人仓库的读权限。这种情形下通常会有个代表“官方”项目的权威的仓库。要为这个项目做贡献，你需要从该项目克隆出一个自己的公开仓库，然后将自己的修改推送上去。接着你可以请求官方仓库的维护者拉取更新合并到主项目。维护者可以将你的仓库作为远程仓库添加进来，在本地测试你的变更，将其合并入他们的分支并推送回官方仓库。这一流程的工作方式如下所示

1. 项目维护者推送到主仓库

2. 贡献者克隆此仓库，做出修改

3. 贡献者将数据推送到自己的公开仓库

4. 贡献者给维护者发送邮件，请求拉取自己的更新

5. 维护者在自己本地的仓库中，将贡献者的仓库加为远程仓库并合并修改

6. 维护者将合并后的修改推送到主仓库

![集成管理者工作流](https://git-scm.com/book/en/v2/images/integration-manager.png)

这是 GitHub 和 GitLab 等集线器式（hub-based）工具最常用的工作流程。人们可以容易地将某个项目派生成为自己的公开仓库，向这个仓库推送自己的修改，并为每个人所见。这么做最主要的优点之一是你可以持续地工作，而主仓库的维护者可以随时拉取你的修改。贡献者不必等待维护者处理完提交的更新 — 每一方都可以按照自己的节奏工作

#### 主管与副主管工作流

这其实是多仓库工作流程的变种。一般拥有数百位协作开发者的超大型项目才会用到这样的工作方式，例如著名的 Linux 内核项目。被称为 副主管（lieutenant）的各个集成管理者分别负责集成项目中的特定部分。所有这些副主管头上还有一位称为 主管（dictator） 的总集成管理者负责统筹。主管维护的仓库作为参考仓库，为所有协作者提供他们需要拉取的项目代码。整个流程看起来是这样的

1. 普通开发者在自己的主题分支上工作，并根据 master 分支进行变基。这里是主管推送的参考仓库的 master 分支

2. 副主管将普通开发者的主题分支合并到自己的 master 分支中

3. 主管将所有副主管的 master 分支并入自己的 master 分支中

4. 最后，主管将集成后的 master 分支推送到参考仓库中，以便所有其他开发者以此为基础进行变基

![主管与副主管工作流](https://git-scm.com/book/en/v2/images/benevolent-dictator.png)

这种工作流程并不常用，只有当项目极为庞杂，或者需要多级别管理时，才会体现出优势。利用这种方式，项目总负责人（即主管）可以把大量分散的集成工作委托给不同的小组负责人分别处理，然后在不同时刻将大块的代码子集统筹起来，用于之后的整合

### 向一个项目贡献

描述如何向一个项目贡献的主要困难在于完成贡献有很多不同的方式。因为 Git 非常灵活，人们可以通过不同的方式来一起工作，所以描述应该如何贡献并不是非常准确 — 每一个项目都有一点儿不同。影响因素包括活跃贡献者的数量、选择的工作流程、提交权限与可能包含的外部贡献方法

第一个影响因素是活跃贡献者的数量 — 积极地向这个项目贡献代码的用户数量以及他们的贡献频率。在许多情况下，你可能会有两三个开发者一天提交几次，对于不活跃的项目可能更少。对于大一些的公司或项目，开发者的数量可能会是上千，每天都有成百上千次提交。这很重要，因为随着开发者越来越多，在确保你的代码能干净地应用或轻松地合并时会遇到更多问题。提交的改动可能表现为过时的，也可能在你正在做改动或者等待改动被批准应用时被合并入的工作严重损坏。如何保证代码始终是最新的，并且提交始终是有效的？

下一个影响因素是项目使用的工作流程。它是中心化的吗，即每一个开发者都对主线代码有相同的写入权限？项目是否有一个检查所有补丁的维护者或整合者？是否所有的补丁是同行评审后批准的？你是否参与了那个过程？是否存在副官系统，你必须先将你的工作提交到上面？

下一个影响因素是提交权限。是否有项目的写权限会使向项目贡献所需的流程有极大的不同。如果没有写权限，项目会选择何种方式接受贡献的工作？是否甚至有一个如何贡献的规范？你一次贡献多少工作？你多久贡献一次？

所有这些问题都会影响实际如何向一个项目贡献，以及对你来说哪些工作流程更适合或者可用。我们将会由浅入深，通过一系列用例来讲述其中的每一个方面；从这些例子应该能够建立实际中你需要的特定工作流程

#### 提交准则

在我们开始查看特定的用例前，这里有一个关于提交信息的快速说明。有一个好的创建提交的准则并且坚持使用会让与 Git 工作和与其他人协作更容易。Git 项目提供了一个文档，其中列举了关于创建提交到提交补丁的若干好的提示 — 可以在 Git 源代码中的 Documentation/SubmittingPatches 文件中阅读它

首先，你的提交不应该包含任何空白错误。Git 提供了一个简单的方式来检查这点 — 在提交前，运行 `git diff --check`，它将会找到可能的空白错误并将它们为你列出来

![git diff --check 的输出](https://git-scm.com/book/en/v2/images/git-diff-check.png)

如果在提交前运行那个命令，可以知道提交中是否包含可能会使其他开发者恼怒的空白问题

接下来，尝试让每一个提交成为一个逻辑上的独立变更集。如果可以，尝试让改动可以理解 — 不要在整个周末编码解决五个问题，然后在周一时将它们提交为一个巨大的提交。即使在周末期间你无法提交，在周一时使用暂存区域将你的工作最少拆分为每个问题一个提交，并且为每一个提交附带一个有用的信息。如果其中一些改动修改了同一个文件，尝试使用 `git add --patch` 来部分暂存文件（在 [交互式暂存](#交互式暂存) 中有详细介绍）。不管你做一个或五个提交，只要所有的改动都曾添加过，项目分支末端的快照就是一样的，所以尽量让你的开发者同事们在审查你的改动的时候更容易些吧

当你之后需要时这个方法也会使拉出或还原一个变更集更容易些。[重写历史](#重写历史) 描述了重写历史与交互式暂存文件的若干有用的 Git 技巧 — 在将工作发送给其他人前使用这些工具来帮助生成一个干净又易懂的历史

最后一件要牢记的事是提交信息。 有一个创建优质提交信息的习惯会使 Git 的使用与协作容易的多。一般情况下，信息应当以少于 50 个字符（25个汉字）的单行开始且简要地描述变更，接着是一个空白行，再接着是一个更详细的解释。Git 项目要求一个更详细的解释，包括做改动的动机和它的实现与之前行为的对比 — 这是一个值得遵循的好规则。使用指令式的语气来编写提交信息，比如使用“Fix bug”而非“Fixed bug”或“Fixes bug”。这里是一份最初由 Tim Pope 写的模板：

```text
首字母大写的摘要（不多于 50 个字符）

如果必要的话，加入更详细的解释文字。在大概 72 个字符的时候换行。
在某些情形下，第一行被当作一封电子邮件的标题，剩下的文本作为正文。
分隔摘要与正文的空行是必须的（除非你完全省略正文），
如果你将两者混在一起，那么类似变基等工具无法正常工作。

使用指令式的语气来编写提交信息：使用“Fix bug”而非“Fixed bug”或“Fixes bug”。
此约定与 git merge 和 git revert 命令生成提交说明相同。

空行接着更进一步的段落。

- 标号也是可以的。

- 项目符号可以使用典型的连字符或星号，后跟一个空格，行之间用空行隔开，
  但是可以依据不同的惯例有所不同。

- 使用悬挂式缩进
```

如果你所有的提交信息都遵循此模版，那么对你和与你协作的其他开发者来说事情会变得非常容易。Git 项目有一个良好格式化的提交信息 — 尝试在那儿运行 `git log --no-merges` 来看看漂亮的格式化的项目提交历史像什么样

#### 私有小型团队

你可能会遇到的最简单的配置是有一两个其他开发者的私有项目。“私有” 在这个上下文中，意味着闭源 — 不可以从外面的世界中访问到。你和其他的开发者都有仓库的推送权限

在这个环境下，可以采用一个类似使用 Subversion 或其他集中式的系统时会使用的工作流程。依然可以得到像离线提交、非常容易地新建分支与合并分支等高级功能，但是工作流程可以是很简单的；主要的区别是合并发生在客户端这边而不是在提交时发生在服务器那边。让我们看看当两个开发者在一个共享仓库中一起工作时会是什么样子。第一个开发者，John，克隆了仓库，做了改动，然后本地提交。（为了缩短这些例子长度，协议信息已被替换为 …）

```text
# John's Machine
$ git clone john@githost:simplegit.git
Cloning into 'simplegit'...
...
$ cd simplegit/
$ vim lib/simplegit.rb
$ git commit -am 'remove invalid default value'
[master 738ee87] remove invalid default value
 1 files changed, 1 insertions(+), 1 deletions(-)
```

第二个开发者，Jessica，做了同样的事情 — 克隆仓库并提交了一个改动：

```text
# Jessica's Machine
$ git clone jessica@githost:simplegit.git
Cloning into 'simplegit'...
...
$ cd simplegit/
$ vim TODO
$ git commit -am 'add reset task'
[master fbff5bc] add reset task
 1 files changed, 1 insertions(+), 0 deletions(-)
```

现在，Jessica 把她的工作推送到服务器上，一切正常：

```text
# Jessica's Machine
$ git push origin master
...
To jessica@githost:simplegit.git
   1edee6b..fbff5bc  master -> master
```

上方输出信息中最后一行显示的是推送操作执行完毕后返回的一条很有用的消息。消息的基本格式是 `<oldref>..<newref> fromref → toref` ， `oldref` 的含义是推送前所指向的引用， `newref` 的含义是推送后所指向的引用， `fromref` 是将要被推送的本地引用的名字，`toref` 是将要被更新的远程引用的名字。 在后面的讨论中你还会看到类似的输出消息，所以对这条消息的含义有一些基础的了解将会帮助你理解仓库的诸多状态

John 稍候也做了些改动，将它们提交到了本地仓库中，然后试着将它们推送到同一个服务器：

```text
# John's Machine
$ git push origin master
To john@githost:simplegit.git
 ! [rejected]        master -> master (non-fast forward)
error: failed to push some refs to 'john@githost:simplegit.git'
```

这时 John 会推送失败，因为之前 Jessica 已经推送了她的更改。如果之前习惯于用 Subversion 那么理解这点特别重要，因为你会注意到两个开发者并没有编辑同一个文件。尽管 Subversion 会对编辑的不同文件在服务器上自动进行一次合并，但 Git 要求你先在本地合并提交。换言之，John 必须先抓取 Jessica 的上游改动并将它们合并到自己的本地仓库中，才能被允许推送

第一步，John 抓取 Jessica 的工作（这只会抓取 Jessica 的上游工作，并不会将它合并到 John 的工作中）：

```text
$ git fetch origin
...
From john@githost:simplegit
 + 049d078...fbff5bc master     -> origin/master
```

在这个时候，John 的本地仓库看起来像这样：

![John 的分叉历史](https://git-scm.com/book/en/v2/images/small-team-1.png)

现在 John 可以将抓取下来的 Jessica 的工作合并到他自己的本地工作中了：

```text
$ git merge origin/master
Merge made by the 'recursive' strategy.
 TODO |    1 +
 1 files changed, 1 insertions(+), 0 deletions(-)
```

合并进行得很顺利 — John 更新后的历史现在看起来像这样：

![合并了 origin/master 之后 John 的仓库](https://git-scm.com/book/en/v2/images/small-team-2.png)

此时，John 可能想要测试新的代码，以确保 Jessica 的工作没有影响他自己的工作，当一切正常后，他就能将新合并的工作推送到服务器了：

```text
$ git push origin master
...
To john@githost:simplegit.git
   fbff5bc..72bbc59  master -> master
```

最终，John 的提交历史看起来像这样：

![推送到 origin 服务器后 John 的历史](https://git-scm.com/book/en/v2/images/small-team-3.png)

在此期间，Jessica 新建了一个名为 issue54 的主题分支，然后在该分支上提交了三次。她还没有抓取 John 的改动，所以她的提交历史看起来像这样：

![Jessica 的主题分支](https://git-scm.com/book/en/v2/images/small-team-4.png)

忽然，Jessica 发现 John 向服务器推送了一些新的工作，她想要看一下，于是就抓取了所有服务器上的新内容：

```text
# Jessica's Machine
$ git fetch origin
...
From jessica@githost:simplegit
   fbff5bc..72bbc59  master     -> origin/master
```

那会同时拉取 John 推送的工作。Jessica 的历史现在看起来像这样：

![抓取 John 的改动后 Jessica 的历史](https://git-scm.com/book/en/v2/images/small-team-5.png)

Jessica 认为她的主题分支已经准备好了，但她想知道需要将 John 工作的哪些合并到自己的工作中才能推送。她运行 `git log` 找了出来：

```text
$ git log --no-merges issue54..origin/master
commit 738ee872852dfaa9d6634e0dea7a324040193016
Author: John Smith <jsmith@example.com>
Date:   Fri May 29 16:01:27 2009 -0700

   remove invalid default value
```

issue54..origin/master 语法是一个日志过滤器，要求 Git 只显示所有在后面分支 （在本例中是 origin/master）但不在前面分支（在本例中是 issue54）的提交的列表。我们将会在 [提交区间](#提交区间) 中详细介绍这个语法

目前，我们可以从输出中看到有一个 John 生成的但是 Jessica 还没有合并的提交。如果她合并 origin/master，那个未合并的提交将会修改她的本地工作

现在，Jessica 可以合并她的特性工作到她的 master 分支，合并 John 的工作（origin/master）进入她的 master 分支，然后再次推送回服务器

首先（在已经提交了所有 issue54 主题分支上的工作后），为了整合所有这些工作，她切换回她的 master 分支

```text
$ git checkout master
Switched to branch 'master'
Your branch is behind 'origin/master' by 2 commits, and can be fast-forwarded.
```

Jessica 既可以先合并 origin/master 也可以先合并 issue54 — 它们都是上游，所以顺序并没有关系。不论她选择的顺序是什么最终的结果快照是完全一样的；只是历史会稍微有些不同。她选择先合并 issue54：

```text
$ git merge issue54
Updating fbff5bc..4af4298
Fast forward
 README           |    1 +
 lib/simplegit.rb |    6 +++++-
 2 files changed, 6 insertions(+), 1 deletions(-)
```

没有发生问题，如你所见它是一次简单的快进合并。现在 Jessica 在本地合并了之前抓取的 origin/master 分支上 John 的工作：

```text
$ git merge origin/master
Auto-merging lib/simplegit.rb
Merge made by the 'recursive' strategy.
 lib/simplegit.rb |    2 +-
 1 files changed, 1 insertions(+), 1 deletions(-)
```

每一个文件都干净地合并了，Jessica 的历史现在看起来像这样：

![合并了 John 的改动后 Jessica 的历史](https://git-scm.com/book/en/v2/images/small-team-6.png)

现在 origin/master 是可以从 Jessica 的 master 分支到达的，所以她应该可以成功地推送（假设同一时间 John 并没有更多推送）：

```text
$ git push origin master
...
To jessica@githost:simplegit.git
   72bbc59..8059c15  master -> master
```

每一个开发者都提交了几次并成功地合并了其他人的工作

![推送所有的改动回服务器后 Jessica 的历史](https://git-scm.com/book/en/v2/images/small-team-7.png)

这是一个最简单的工作流程。你通常会在一个主题分支上工作一会儿，当它准备好整合时就合并到你的 master 分支。当想要共享工作时，如果有改动的话就抓取它然后合并到你自己的 master 分支，之后推送到服务器上的 master 分支。通常顺序像这样：

![一个简单的多人 Git 工作流程的通常事件顺序](https://git-scm.com/book/en/v2/images/small-team-flow.png)

#### 私有管理团队

在接下来的场景中，你会看到大型私有团队中贡献者的角色。你将学到如何在这种工作环境中工作，其中小组基于特性进行协作，而这些团队的贡献将会由其他人整合

让我们假设 John 与 Jessica 在一个特性（featureA）上工作，同时 Jessica 与第三个开发者 Josie 在第二个特性（featureB）上工作。在本例中，公司使用了一种整合-管理者工作流程，独立小组的工作只能被特定的工程师整合，主仓库的 master 分支只能被那些工程师更新。在这种情况下，所有的工作都是在基于团队的分支上完成的并且稍后会被整合者拉到一起

因为 Jessica 在两个特性上工作，并且平行地与两个不同的开发者协作，让我们跟随她的工作流程。假设她已经克隆了仓库，首先决定在 featureA 上工作。她为那个特性创建了一个新分支然后在那做了一些工作：

```text
# Jessica's Machine
$ git checkout -b featureA
Switched to a new branch 'featureA'
$ vim lib/simplegit.rb
$ git commit -am 'add limit to log function'
[featureA 3300904] add limit to log function
 1 files changed, 1 insertions(+), 1 deletions(-)
```

在这个时候，她需要将工作共享给 John，所以她推送了 featureA 分支的提交到服务器上。Jessica 没有 master 分支的推送权限 — 只有整合者有 — 所以为了与 John 协作必须推送另一个分支

```text
$ git push -u origin featureA
...
To jessica@githost:simplegit.git
 * [new branch]      featureA -> featureA
```

Jessica 向 John 发邮件告诉他已经推送了一些工作到 featureA 分支现在可以看一看。当她等待 John 的反馈时，Jessica 决定与 Josie 开始在 featureB 上工作。为了开始工作，她基于服务器的 master 分支开始了一个新分支

```text
# Jessica's Machine
$ git fetch origin
$ git checkout -b featureB origin/master
Switched to a new branch 'featureB'
```

现在，Jessica 在 featureB 分支上创建了几次提交：

```text
$ vim lib/simplegit.rb
$ git commit -am 'made the ls-tree function recursive'
[featureB e5b0fdc] made the ls-tree function recursive
 1 files changed, 1 insertions(+), 1 deletions(-)
$ vim lib/simplegit.rb
$ git commit -am 'add ls-files'
[featureB 8512791] add ls-files
 1 files changed, 5 insertions(+), 0 deletions(-)
```

现在 Jessica 的仓库看起来像这样：

![Jessica 的初始提交历史](https://git-scm.com/book/en/v2/images/managed-team-1.png)

她准备好推送工作了，但是一封来自 Josie 的邮件告知一些初始的“featureB” 工作已经被推送到服务器的 featureBee 上了。Jessica 在能够将她的工作推送到服务器前，需要将那些改动与她自己的合并。她首先通过 `git fetch` 抓取了 Josie 的改动：

```text
$ git fetch origin
...
From jessica@githost:simplegit
 * [new branch]      featureBee -> origin/featureBee
```

假设 Jessica 还在她检出的 featureB 分支上，现在可以通过 `git merge` 将其合并到她做的工作中了：

```text
$ git merge origin/featureBee
Auto-merging lib/simplegit.rb
Merge made by the 'recursive' strategy.
 lib/simplegit.rb |    4 ++++
 1 files changed, 4 insertions(+), 0 deletions(-)
```

此时，Jessica 想要将所有合并后的“featureB”推送回服务器，但她并不想直接推送她自己的 featureB 分支。由于 Josie 已经开启了一个上游的 featureBee 分支，因此 Jessica 想要推送到这个分支上，于是她这样做：

```text
$ git push -u origin featureB:featureBee
...
To jessica@githost:simplegit.git
   fba9af8..cd685d1  featureB -> featureBee
```

这称作一个 引用规范。 查看 [引用规范](#引用规范) 了解关于 Git 引用规范与通过它们可以做的不同的事情的详细讨论。也要注意 `-u` 标记；这是 `--set-upstream` 的简写，该标记会为之后轻松地推送与拉取配置分支

紧接着，John 发邮件给 Jessica 说他已经推送了一些改动到 featureA 分支并要求她去验证它们。她运行一个 `git fetch` 来拉取下那些改动：

```text
$ git fetch origin
...
From jessica@githost:simplegit
   3300904..aad881d  featureA   -> origin/featureA
```

Jessica 通过比较新抓取的 featureA 分支和她同一分支的本地副本，看到了 John 的新工作日志

```text
$ git log featureA..origin/featureA
commit aad881d154acdaeb2b6b18ea0e827ed8a6d671e6
Author: John Smith <jsmith@example.com>
Date:   Fri May 29 19:57:33 2009 -0700

    changed log output to 30 from 25
```

如果 Jessica 觉得可以，她就能将 John 的新工作合并到她本地的 featureA 分支上：

```text
$ git checkout featureA
Switched to branch 'featureA'
$ git merge origin/featureA
Updating 3300904..aad881d
Fast forward
 lib/simplegit.rb |   10 +++++++++-
1 files changed, 9 insertions(+), 1 deletions(-)
```

最后，Jessica 可能想要对整个合并后的内容做一些小修改，于是她将这些修改提交到了本地的 featureA 分支，接着将最终的结果推送回了服务器

```text
$ git commit -am 'small tweak'
[featureA 774b3ed] small tweak
 1 files changed, 1 insertions(+), 1 deletions(-)
$ git push
...
To jessica@githost:simplegit.git
   3300904..774b3ed  featureA -> featureA
```

Jessica 的提交历史现在看起来像这样：

![在一个主题分支提交后 Jessica 的历史](https://git-scm.com/book/en/v2/images/managed-team-2.png)

这时，Jessica、Josie 与 John 通知整合者服务器上的 featureA 与 featureBee 分支准备好整合到主线中了。在整合者将这些分支合并到主线后，就能一次将这个新的合并提交抓取下来，历史看起来就会像这样：

![合并了 Jessica 的两个主题分支后她的历史](https://git-scm.com/book/en/v2/images/managed-team-3.png)

许多团队切换到 Git 就是看中了这种能让多个团队并行工作、并在之后合并不同工作的能力。团队中更小一些的子小组可以通过远程分支协作而不必影响或妨碍整个团队的能力是 Git 的一个巨大优势。在这儿看到的工作流程顺序类似这样：

![这种管理团队工作流程的基本顺序](https://git-scm.com/book/en/v2/images/managed-team-flow.png)

#### 派生的公开项目

向公开项目做贡献有一点儿不同。因为没有权限直接更新项目的分支，你必须用其他办法将工作给维护者。第一个例子描述在支持简单派生的 Git 托管上使用派生来做贡献。许多托管站点支持这个功能（包括 GitHub、BitBucket、repo.or.cz 等等），许多项目维护者期望这种风格的贡献。下一节会讨论偏好通过邮件接受贡献补丁的项目

首先，你可能想要克隆主仓库，为计划贡献的补丁或补丁序列创建一个主题分支，然后在那儿做工作。顺序看起来基本像这样：

```text
$ git clone <url>
$ cd project
$ git checkout -b featureA
  ... work ...
$ git commit
  ... work ...
$ git commit
```

你可以用 `rebase -i` 将工作压缩成一个单独的提交，或者重排提交中的工作使补丁更容易被维护者审核 — 查看 [重写历史](#重写历史) 了解关于交互式变基的更多信息

当你的分支工作完成后准备将其贡献回维护者，去原始项目中然后点击“Fork”按钮，创建一份自己的可写的项目派生仓库。然后需要在本地仓库中将该仓库添加为一个新的远程仓库，在本例中称作 myfork：

```shell
$ git remote add myfork <url>
```

然后需要推送工作到上面。相对于合并到主分支再推送上去，推送你正在工作的主题分支到仓库上更简单。原因是工作如果不被接受或者是被拣选的，就不必回退你的 master 分支（拣选操作 cherry-pick 详见 变基与拣选工作流）。如果维护者合并、变基或拣选你的工作，不管怎样你最终会通过拉取他们的仓库找回来你的工作

在任何情况下，你都可以使用下面的命令推送你的工作：

```shell
$ git push -u myfork featureA
```

当工作已经被推送到你的派生仓库后，你需要通知原项目的维护者你有想要他们合并的工作。这通常被称作一个 拉取请求（Pull Request），你通常可以通过网站生成它 — GitHub 有它自己的 Pull Request 机制，我们将会在 [GitHub](#github) 介绍 — 也可以运行 `git request-pull` 命令然后将随后的输出通过电子邮件手动发送给项目维护者

`git request-pull` 命令接受一个要拉取主题分支的基础分支，以及它们要拉取的 Git 仓库的 URL，产生一个请求拉取的所有修改的摘要。例如，Jessica 想要发送给 John 一个拉取请求，她已经在刚刚推送的分支上做了两次提交。她可以运行这个：

```text
$ git request-pull origin/master myfork
The following changes since commit 1edee6b1d61823a2de3b09c160d7080b8d1b3a40:
Jessica Smith (1):
        added a new function

are available in the git repository at:

  git://githost/simplegit.git featureA

Jessica Smith (2):
      add limit to log function
      change log output to 30 from 25

 lib/simplegit.rb |   10 +++++++++-
 1 files changed, 9 insertions(+), 1 deletions(-)
```

此输出可被发送给维护者 — 它告诉他们工作是从哪个分支开始的、提交的摘要、以及从哪里拉取这些工作

在一个你不是维护者的项目上，通常有一个总是跟踪 origin/master 的 master 分支会很方便，在主题分支上做工作是因为如果它们被拒绝时你可以轻松地丢弃。如果同一时间主仓库移动了然后你的提交不再能干净地应用，那么使工作主题独立于主题分支也会使你变基（rebase）工作时更容易。例如，你想要提供第二个特性工作到项目，不要继续在刚刚推送的主题分支上工作 — 从主仓库的 master 分支重新开始：

```text
$ git checkout -b featureB origin/master
  ... work ...
$ git commit
$ git push myfork featureB
$ git request-pull origin/master myfork
  ... email generated request pull to maintainer ...
$ git fetch origin
```

现在，每一个特性都保存在一个贮藏库中 — 类似于补丁队列 — 可以重写、变基与修改而不会让特性互相干涉或互相依赖，像这样：

![featureB 的初始提交历史](https://git-scm.com/book/en/v2/images/public-small-1.png)

假设项目维护者已经拉取了一串其他补丁，然后尝试拉取你的第一个分支，但是没有干净地合并。在这种情况下，可以尝试变基那个分支到 origin/master 的顶部，为维护者解决冲突，然后重新提交你的改动：

```text
$ git checkout featureA
$ git rebase origin/master
$ git push -f myfork featureA
```

这样会重写你的历史，现在看起来像是 featureA 工作之后的提交历史

![featureA 工作之后的提交历史](https://git-scm.com/book/en/v2/images/public-small-2.png)

因为你将分支变基了，所以必须为推送命令指定 `-f` 选项，这样才能将服务器上有一个不是它的后代的提交的 featureA 分支替换掉。一个替代的选项是推送这个新工作到服务器上的一个不同分支（可能称作 featureAv2）

让我们看一个更有可能的情况：维护者看到了你的第二个分支上的工作并且很喜欢其中的概念，但是想要你修改一下实现的细节。你也可以利用这次机会将工作基于项目现在的 master 分支。你从现在的 origin/master 分支开始一个新分支，在那儿压缩 featureB 的改动，解决任何冲突，改变实现，然后推送它为一个新分支

```text
$ git checkout -b featureBv2 origin/master
$ git merge --squash featureB
  ... change implementation ...
$ git commit
$ git push myfork featureBv2
```

`--squash` 选项接受被合并的分支上的所有工作，并将其压缩至一个变更集，使仓库变成一个真正的合并发生的状态，而不会真的生成一个合并提交。这意味着你的未来的提交将会只有一个父提交，并允许你引入另一个分支的所有改动，然后在记录一个新提交前做更多的改动。同样 `--no-commit` 选项在默认合并过程中可以用来延迟生成合并提交

现在你可以给维护者发送一条消息，表示你已经做了要求的修改然后他们可以在你的 featureBv2 分支上找到那些改动

![featureBv2 工作之后的提交历史](https://git-scm.com/book/en/v2/images/public-small-3.png)

## GitHub

### 对项目做出贡献

#### 让你的 GitHub 公共仓库保持更新

## Git 工具

### 选择修订版本

#### 提交区间

### 交互式暂存

### 贮藏与清理

有时，当你在项目的一部分上已经工作一段时间后，所有东西都进入了混乱的状态，而这时你想要切换到另一个分支做一点别的事情。问题是，你不想仅仅因为过会儿回到这一点而为做了一半的工作创建一次提交。针对这个问题的答案是 `git stash` 命令

贮藏（stash）会处理工作目录的脏的状态—即跟踪文件的修改与暂存的改动—然后将未完成的修改保存到一个栈上，而你可以在任何时候重新应用这些改动（甚至在不同的分支上）

迁移到 git stash push：截至 2017 年 10 月下旬，Git 邮件列表上进行了广泛讨论，该讨论中弃用了 `git stash save` 命令，代之以现有 `git stash push` 命令。主因是 `git stash push` 引入了贮藏选定的路径规范的选项，而有些东西 `git stash save` 不支持

#### 贮藏工作

为了演示贮藏，你需要进入项目并改动几个文件，然后可以暂存其中的一个改动。如果运行 `git status`，可以看到有改动的状态：

```text
$ git status
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	modified:   index.html

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   lib/simplegit.rb
```

现在想要切换分支，但是还不想要提交之前的工作；所以贮藏修改。将新的贮藏推送到栈上，运行 `git stash` 或 `git stash push`：

```text
$ git stash push
Saved working directory and index state \
  "WIP on master: 049d078 added the index file"
HEAD is now at 049d078 added the index file
(To restore them type "git stash apply")
```

可以看到工作目录是干净的了：

```text
$ git status
# On branch master
nothing to commit, working directory clean
```

此时，你可以切换分支并在其他地方工作；你的修改被存储在栈上。要查看贮藏的东西，可以使用 `git stash list`：

```text
$ git stash list
stash@{0}: WIP on master: 049d078 added the index file
stash@{1}: WIP on master: c264051 Revert "added file_size"
stash@{2}: WIP on master: 21d80a5 added number to log
```

在本例中，有两个之前的贮藏，所以你接触到了三个不同的贮藏工作。可以通过原来 `stash` 命令的帮助提示中的命令将你刚刚贮藏的工作重新应用：`git stash apply`。如果想要应用其中一个更旧的贮藏，可以通过名字指定它，像这样：`git stash apply stash@{2}`。如果不指定一个贮藏，Git 认为指定的是最近的贮藏：

```text
$ git stash apply
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   index.html
	modified:   lib/simplegit.rb

no changes added to commit (use "git add" and/or "git commit -a")
```

可以看到 Git 重新修改了当你保存贮藏时撤消的文件。在本例中，当尝试应用贮藏时有一个干净的工作目录，并且尝试将它应用在保存它时所在的分支。并不是必须要有一个干净的工作目录，或者要应用到同一分支才能成功应用贮藏。可以在一个分支上保存一个贮藏，切换到另一个分支，然后尝试重新应用这些修改。当应用贮藏时工作目录中也可以有修改与未提交的文件—如果有任何东西不能干净地应用，Git 会产生合并冲突

文件的改动被重新应用了，但是之前暂存的文件却没有重新暂存。想要那样的话，必须使用 `--index` 选项来运行 `git stash apply` 命令，来尝试重新应用暂存的修改。如果已经那样做了，那么你将回到原来的位置：

```text
$ git stash apply --index
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	modified:   index.html

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   lib/simplegit.rb
```

应用选项只会尝试应用贮藏的工作—在堆栈上还有它。可以运行 `git stash drop` 加上将要移除的贮藏的名字来移除它：

```text
$ git stash list
stash@{0}: WIP on master: 049d078 added the index file
stash@{1}: WIP on master: c264051 Revert "added file_size"
stash@{2}: WIP on master: 21d80a5 added number to log
$ git stash drop stash@{0}
Dropped stash@{0} (364e91f3f268f0900bc3ee613f9f733e82aaed43)
```

也可以运行 `git stash pop` 来应用贮藏然后立即从栈上扔掉它

#### 贮藏的创意性使用

有几个贮藏的变种可能也很有用。第一个非常流行的选项是 `git stash` 命令的 `--keep-index` 选项。它告诉 Git 不仅要贮藏所有已暂存的内容，同时还要将它们保留在索引中

```text
$ git status -s
M  index.html
 M lib/simplegit.rb

$ git stash --keep-index
Saved working directory and index state WIP on master: 1b65b17 added the index file
HEAD is now at 1b65b17 added the index file

$ git status -s
M  index.html
```

另一个经常使用贮藏来做的事情是像贮藏跟踪文件一样贮藏未跟踪文件。默认情况下，`git stash` 只会贮藏已修改和暂存的已跟踪文件。如果指定 `--include-untracked` 或 `-u` 选项，Git 也会贮藏任何未跟踪文件。然而，在贮藏中包含未跟踪的文件仍然不会包含明确忽略的文件。要额外包含忽略的文件，请使用 `--all` 或 `-a` 选项

```text
$ git status -s
M  index.html
 M lib/simplegit.rb
?? new-file.txt

$ git stash -u
Saved working directory and index state WIP on master: 1b65b17 added the index file
HEAD is now at 1b65b17 added the index file

$ git status -s
$
```

最终，如果指定了 `--patch` 标记，Git 不会贮藏所有修改过的任何东西，但是会交互式地提示哪些改动想要贮藏、哪些改动需要保存在工作目录中

```text
$ git stash --patch
diff --git a/lib/simplegit.rb b/lib/simplegit.rb
index 66d332e..8bb5674 100644
--- a/lib/simplegit.rb
+++ b/lib/simplegit.rb
@@ -16,6 +16,10 @@ class SimpleGit
         return `#{git_cmd} 2>&1`.chomp
       end
     end
+
+    def show(treeish = 'master')
+      command("git show #{treeish}")
+    end

 end
 test
Stash this hunk [y,n,q,a,d,/,e,?]? y

Saved working directory and index state WIP on master: 1b65b17 added the index file
```

#### 从贮藏创建一个分支

如果贮藏了一些工作，将它留在那儿了一会儿，然后继续在贮藏的分支上工作，在重新应用工作时可能会有问题。如果应用尝试修改刚刚修改的文件，你会得到一个合并冲突并不得不解决它。如果想要一个轻松的方式来再次测试贮藏的改动，可以运行 `git stash branch <new branchname>` 以你指定的分支名创建一个新分支，检出贮藏工作时所在的提交，重新在那应用工作，然后在应用成功后丢弃贮藏：

```text
$ git stash branch testchanges
M	index.html
M	lib/simplegit.rb
Switched to a new branch 'testchanges'
On branch testchanges
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	modified:   index.html

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   lib/simplegit.rb

Dropped refs/stash@{0} (29d385a81d163dfd45a452a2ce816487a6b8b014)
```

这是在新分支轻松恢复贮藏工作并继续工作的一个很不错的途径

#### 清理工作目录

对于工作目录中一些工作或文件，你想做的也许不是贮藏而是移除。`git clean` 命令就是用来干这个的

清理工作目录有一些常见的原因，比如说为了移除由合并或外部工具生成的东西， 或是为了运行一个干净的构建而移除之前构建的残留

你需要谨慎地使用这个命令，因为它被设计为从工作目录中移除未被追踪的文件。如果你改变主意了，你也不一定能找回来那些文件的内容。一个更安全的选项是运行 `git stash --all` 来移除每一样东西并存放在栈中

你可以使用 `git clean` 命令去除冗余文件或者清理工作目录。使用 `git clean -f -d` 命令来移除工作目录中所有未追踪的文件以及空的子目录。`-f` 意味着“强制（force）”或“确定要移除”，使用它需要 Git 配置变量 clean.requireForce 没有显式设置为 false

如果只是想要看看它会做什么，可以使用 `--dry-run` 或 `-n` 选项来运行命令，这意味着“做一次演习然后告诉你将要移除什么”

```text
$ git clean -d -n
Would remove test.o
Would remove tmp/
```

默认情况下，`git clean` 命令只会移除没有忽略的未跟踪文件。任何与 .gitignore 或其他忽略文件中的模式匹配的文件都不会被移除。如果你也想要移除那些文件，例如为了做一次完全干净的构建而移除所有由构建生成的 .o 文件，可以给 clean 命令增加一个 `-x` 选项

```text
$ git status -s
 M lib/simplegit.rb
?? build.TMP
?? tmp/

$ git clean -n -d
Would remove build.TMP
Would remove tmp/

$ git clean -n -d -x
Would remove build.TMP
Would remove test.o
Would remove tmp/
```

如果不知道 `git clean` 命令将会做什么，在将 `-n` 改为 `-f` 来真正做之前总是先用 `-n` 来运行它做双重检查。另一个小心处理过程的方式是使用 `-i` 或 “interactive” 标记来运行它

这将会以交互模式运行 clean 命令

```text
$ git clean -x -i
Would remove the following items:
  build.TMP  test.o
*** Commands ***
    1: clean                2: filter by pattern    3: select by numbers    4: ask each             5: quit
    6: help
What now>
```

这种方式下可以分别地检查每一个文件或者交互地指定删除的模式

在一种奇怪的情况下，可能需要格外用力才能让 Git 清理你的工作目录。如果你恰好在工作目录中复制或克隆了其他 Git 仓库（可能是子模块），那么即便是 `git clean -f -d` 都会拒绝删除这些目录。这种情况下，你需要加上第二个 `-f` 选项来强调

### 重写历史

### 重置揭密

### 凭证存储

## 自定义 Git

### Git 钩子

### 使用强制策略的一个例子

#### 指定特殊的提交信息格式

## Git 与其他系统

## Git 内部原理

### 底层命令与上层命令

当在一个新目录或已有目录执行 git init 时，Git 会创建一个 .git 目录。这个目录包含了几乎所有 Git 存储和操作的东西。如若想备份或复制一个版本库，只需把这个目录拷贝至另一处即可。本章探讨的所有内容，均位于这个目录内。新初始化的 .git 目录的典型结构如下：

```text
$ ls -F1
config
description
HEAD
hooks/
info/
objects/
refs/
```

随着 Git 版本的不同，该目录下可能还会包含其他内容。不过对于一个全新的 `git init` 版本库，这将是你看到的默认结构。description 文件仅供 GitWeb 程序使用，我们无需关心。config 文件包含项目特有的配置选项。 info 目录包含一个全局性排除（global exclude）文件， 用以放置那些不希望被记录在 .gitignore 文件中的忽略模式（ignored patterns）。hooks 目录包含客户端或服务端的钩子脚本（hook scripts），在 [Git 钩子](#git-钩子) 中这部分话题已被详细探讨过

剩下的四个条目很重要：HEAD 文件、（尚待创建的）index 文件，和 objects 目录、refs 目录。它们都是 Git 的核心组成部分。objects 目录存储所有数据内容；refs 目录存储指向数据（分支、远程仓库和标签等）的提交对象的指针；HEAD 文件指向目前被检出的分支；index 文件保存暂存区信息。我们将详细地逐一检视这四部分，来理解 Git 是如何运转的

### 引用规范

纵观全书，我们已经使用过一些诸如远程分支到本地引用的简单映射方式，但这种映射可以更复杂。假设你已经跟着前几节在本地创建了一个小的 Git 仓库，现在想要添加一个远程仓库：

```shell
$ git remote add origin https://github.com/schacon/simplegit-progit
```

运行上述命令会在你仓库中的 .git/config 文件中添加一个小节，并在其中指定远程版本库的名称（origin）、URL 和一个用于获取操作的 引用规范（refspec）：

```text
[remote "origin"]
	url = https://github.com/schacon/simplegit-progit
	fetch = +refs/heads/*:refs/remotes/origin/*
```

引用规范的格式由一个可选的 + 号和紧随其后的 `<src>:<dst>` 组成，其中 `<src>` 是一个模式（pattern），代表远程版本库中的引用；`<dst>` 是本地跟踪的远程引用的位置。+ 号告诉 Git 即使在不能快进的情况下也要（强制）更新引用

默认情况下，引用规范由 `git remote add origin` 命令自动生成，Git 获取服务器中 refs/heads/ 下面的所有引用，并将它写入到本地的 refs/remotes/origin/ 中。所以，如果服务器上有一个 master 分支，你可以在本地通过下面任意一种方式来访问该分支上的提交记录：

```shell
$ git log origin/master
$ git log remotes/origin/master
$ git log refs/remotes/origin/master
```

上面的三个命令作用相同，因为 Git 会把它们都扩展成 refs/remotes/origin/master

如果想让 Git 每次只拉取远程的 master 分支，而不是所有分支，可以把（引用规范的）获取那一行修改为只引用该分支：

```text
fetch = +refs/heads/master:refs/remotes/origin/master
```

这仅是针对该远程版本库的 `git fetch` 操作的默认引用规范。如果有某些只希望被执行一次的操作，我们也可以在命令行指定引用规范。若要将远程的 master 分支拉到本地的 origin/mymaster 分支，可以运行：

```shell
$ git fetch origin master:refs/remotes/origin/mymaster
```

你也可以指定多个引用规范。在命令行中，你可以按照如下的方式拉取多个分支：

```text
$ git fetch origin master:refs/remotes/origin/mymaster \
	 topic:refs/remotes/origin/topic
From git@github.com:schacon/simplegit
 ! [rejected]        master     -> origin/mymaster  (non fast forward)
 * [new branch]      topic      -> origin/topic
```

在这个例子中，对 master 分支的拉取操作被拒绝，因为它不是一个可以快进的引用。我们可以通过在引用规范之前指定 + 号来覆盖该规则

你也可以在配置文件中指定多个用于获取操作的引用规范。如果想在每次从 origin 远程仓库获取时都包括 master 和 experiment 分支，添加如下两行：

```text
[remote "origin"]
	url = https://github.com/schacon/simplegit-progit
	fetch = +refs/heads/master:refs/remotes/origin/master
	fetch = +refs/heads/experiment:refs/remotes/origin/experiment
```

我们不能在模式中使用部分通配符，所以像下面这样的引用规范是不合法的：

```text
fetch = +refs/heads/qa*:refs/remotes/origin/qa*
```

但我们可以使用命名空间（或目录）来达到类似目的。假设你有一个 QA 团队，他们推送了一系列分支，同时你只想要获取 master 和 QA 团队的所有分支而不关心其他任何分支，那么可以使用如下配置：

```text
[remote "origin"]
	url = https://github.com/schacon/simplegit-progit
	fetch = +refs/heads/master:refs/remotes/origin/master
	fetch = +refs/heads/qa/*:refs/remotes/origin/qa/*
```

如果项目的工作流很复杂，有 QA 团队推送分支、开发人员推送分支、集成团队推送并且在远程分支上展开协作，你就可以像这样（在本地）为这些分支创建各自的命名空间，非常方便

#### 引用规范推送

像上面这样从远程版本库获取已在命名空间中的引用当然很棒，但 QA 团队最初应该如何将他们的分支放入远程的 qa/ 命名空间呢？我们可以通过引用规范推送来完成这个任务

如果 QA 团队想把他们的 master 分支推送到远程服务器的 qa/master 分支上，可以运行：

```shell
$ git push origin master:refs/heads/qa/master
```

如果他们希望 Git 每次运行 `git push origin` 时都像上面这样推送，可以在他们的配置文件中添加一条 push 值：

```text
[remote "origin"]
	url = https://github.com/schacon/simplegit-progit
	fetch = +refs/heads/*:refs/remotes/origin/*
	push = refs/heads/master:refs/heads/qa/master
```

正如刚才所指出的，这会让 git push origin 默认把本地 master 分支推送到远程 qa/master 分支

你无法通过引用规范从一个仓库获取并推送到另一个仓库。 这样做的示例见 [让你的 GitHub 公共仓库保持更新]()

#### 删除引用

你还可以借助类似下面的命令通过引用规范从远程服务器上删除引用：

```shell
$ git push origin :topic
```

因为引用规范（的格式）是 `<src>:<dst>`，所以上述命令把 `<src>` 留空，意味着把远程版本库的 topic 分支定义为空值，也就是删除它

或者你可以使用更新的语法（自 Git v1.7.0 以后可用）：

```shell
$ git push origin --delete topic
```

### 维护与数据恢复

有的时候，你需要对仓库进行清理 — 使它的结构变得更紧凑，或是对导入的仓库进行清理，或是恢复丢失的内容。这个小节将会介绍这些情况中的一部分

#### 维护

Git 会不定时地自动运行一个叫做 “auto gc” 的命令。大多数时候，这个命令并不会产生效果。然而，如果有太多松散对象（不在包文件中的对象）或者太多包文件，Git 会运行一个完整的 `git gc` 命令。“gc” 代表垃圾回收，这个命令会做以下事情：收集所有松散对象并将它们放置到包文件中，将多个包文件合并为一个大的包文件，移除与任何提交都不相关的陈旧对象

可以像下面一样手动执行自动垃圾回收：

```shell
$ git gc --auto
```

就像上面提到的，这个命令通常并不会产生效果。大约需要 7000 个以上的松散对象或超过 50 个的包文件才能让 Git 启动一次真正的 gc 命令。你可以通过修改 gc.auto 与 gc.autopacklimit 的设置来改动这些数值

gc 将会做的另一件事是打包你的引用到一个单独的文件。假设你的仓库包含以下分支与标签：

```text
$ find .git/refs -type f
.git/refs/heads/experiment
.git/refs/heads/master
.git/refs/tags/v1.0
.git/refs/tags/v1.1
```

如果你执行了 `git gc` 命令，refs 目录中将不会再有这些文件。为了保证效率 Git 会将它们移动到名为 .git/packed-refs 的文件中，就像这样：

```text
$ cat .git/packed-refs
# pack-refs with: peeled fully-peeled
cac0cab538b970a37ea1e769cbbde608743bc96d refs/heads/experiment
ab1afef80fac8e34258ff41fc1b867c702daa24b refs/heads/master
cac0cab538b970a37ea1e769cbbde608743bc96d refs/tags/v1.0
9585191f37f7b0fb9444f35a9bf50de191beadc2 refs/tags/v1.1
^1a410efbd13591db07496601ebc7a059dd55cfe9
```

如果你更新了引用，Git 并不会修改这个文件，而是向 refs/heads 创建一个新的文件。为了获得指定引用的正确 SHA-1 值，Git 会首先在 refs 目录中查找指定的引用，然后再到 packed-refs 文件中查找。所以，如果你在 refs 目录中找不到一个引用，那么它或许在 packed-refs 文件中

注意这个文件的最后一行，它会以 ^ 开头。这个符号表示它上一行的标签是附注标签，^ 所在的那一行是附注标签指向的那个提交

#### 数据恢复

在你使用 Git 的时候，你可能会意外丢失一次提交。通常这是因为你强制删除了正在工作的分支，但是最后却发现你还需要这个分支，亦或者硬重置了一个分支，放弃了你想要的提交。如果这些事情已经发生，该如何找回你的提交呢？

下面的例子将硬重置你的测试仓库中的 master 分支到一个旧的提交，以此来恢复丢失的提交。首先，让我们看看你的仓库现在在什么地方：

```text
$ git log --pretty=oneline
ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
cac0cab538b970a37ea1e769cbbde608743bc96d second commit
fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit
```

现在，我们将 master 分支硬重置到第三次提交：

```text
$ git reset --hard 1a410efbd13591db07496601ebc7a059dd55cfe9
HEAD is now at 1a410ef third commit
$ git log --pretty=oneline
1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
cac0cab538b970a37ea1e769cbbde608743bc96d second commit
fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit
```

现在顶部的两个提交已经丢失了 — 没有分支指向这些提交。你需要找出最后一次提交的 SHA-1 然后增加一个指向它的分支。窍门就是找到最后一次的提交的 SHA-1 — 但是估计你记不起来了，对吗？

最方便，也是最常用的方法，是使用一个名叫 `git reflog` 的工具。当你正在工作时，Git 会默默地记录每一次你改变 HEAD 时它的值。每一次你提交或改变分支，引用日志都会被更新。引用日志（reflog）也可以通过 `git update-ref` 命令更新，我们在 Git 引用 有提到使用这个命令而不是是直接将 SHA-1 的值写入引用文件中的原因。你可以在任何时候通过执行 `git reflog` 命令来了解你曾经做过什么：

```text
$ git reflog
1a410ef HEAD@{0}: reset: moving to 1a410ef
ab1afef HEAD@{1}: commit: modified repo.rb a bit
484a592 HEAD@{2}: commit: added repo.rb
```

这里可以看到我们已经检出的两次提交，然而并没有足够多的信息。为了使显示的信息更加有用，我们可以执行 `git log -g`，这个命令会以标准日志的格式输出引用日志

```text
$ git log -g
commit 1a410efbd13591db07496601ebc7a059dd55cfe9
Reflog: HEAD@{0} (Scott Chacon <schacon@gmail.com>)
Reflog message: updating HEAD
Author: Scott Chacon <schacon@gmail.com>
Date:   Fri May 22 18:22:37 2009 -0700

		third commit

commit ab1afef80fac8e34258ff41fc1b867c702daa24b
Reflog: HEAD@{1} (Scott Chacon <schacon@gmail.com>)
Reflog message: updating HEAD
Author: Scott Chacon <schacon@gmail.com>
Date:   Fri May 22 18:15:24 2009 -0700

       modified repo.rb a bit
```

看起来下面的那个就是你丢失的提交，你可以通过创建一个新的分支指向这个提交来恢复它。例如，你可以创建一个名为 recover-branch 的分支指向这个提交（ab1afef）：

```text
$ git branch recover-branch ab1afef
$ git log --pretty=oneline recover-branch
ab1afef80fac8e34258ff41fc1b867c702daa24b modified repo a bit
484a59275031909e19aadb7c92262719cfcdf19a added repo.rb
1a410efbd13591db07496601ebc7a059dd55cfe9 third commit
cac0cab538b970a37ea1e769cbbde608743bc96d second commit
fdf4fc3344e67ab068f836878b6c4951e3b15f3d first commit
```

不错，现在有一个名为 recover-branch 的分支是你的 master 分支曾经指向的地方，再一次使得前两次提交可到达了。接下来，假设你丢失的提交因为某些原因不在引用日志中，那么我们可以通过移除 recover-branch 分支并删除引用日志来模拟这种情况。现在前两次提交又不被任何分支指向了：

```shell
$ git branch -D recover-branch
$ rm -Rf .git/logs/
```

由于引用日志数据存放在 .git/logs/ 目录中，现在你已经没有引用日志了。这时该如何恢复那次提交？一种方式是使用 `git fsck` 实用工具，将会检查数据库的完整性。如果使用一个 `--full` 选项运行它，它会向你显示出所有没有被其他对象指向的对象：

```text
$ git fsck --full
Checking object directories: 100% (256/256), done.
Checking objects: 100% (18/18), done.
dangling blob d670460b4b4aece5915caf5c68d12f560a9fe3e4
dangling commit ab1afef80fac8e34258ff41fc1b867c702daa24b
dangling tree aea790b9a58f6cf6f2804eeac9f0abbe9631e4c9
dangling blob 7108f7ecb345ee9d0084193f147cdad4d2998293
```

在这个例子中，你可以在 “dangling commit” 后看到你丢失的提交。现在你可以用和之前相同的方法恢复这个提交，也就是添加一个指向这个提交的分支

#### 移除对象

Git 有很多很棒的功能，但是其中一个特性会导致问题，`git clone` 会下载整个项目的历史，包括每一个文件的每一个版本。如果所有的东西都是源代码那么这很好，因为 Git 被高度优化来有效地存储这种数据。然而，如果某个人在之前向项目添加了一个大小特别大的文件，即使你将这个文件从项目中移除了，每次克隆还是都要强制的下载这个大文件。之所以会产生这个问题，是因为这个文件在历史中是存在的，它会永远在那里

当你迁移 Subversion 或 Perforce 仓库到 Git 的时候，这会是一个严重的问题。因为这些版本控制系统并不下载所有的历史文件，所以这种文件所带来的问题比较少。如果你从其他的版本控制系统迁移到 Git 时发现仓库比预期的大得多，那么你就需要找到并移除这些大文件

警告：**这个操作对提交历史的修改是破坏性的**。 它会从你必须修改或移除一个大文件引用最早的树对象开始重写每一次提交。如果你在导入仓库后，在任何人开始基于这些提交工作前执行这个操作，那么将不会有任何问题 — 否则，你必须通知所有的贡献者他们需要将他们的成果变基到你的新提交上

为了演示，我们将添加一个大文件到测试仓库中，并在下一次提交中删除它，现在我们需要找到它，并将它从仓库中永久删除。首先，添加一个大文件到仓库中：

```text
$ curl https://www.kernel.org/pub/software/scm/git/git-2.1.0.tar.gz > git.tgz
$ git add git.tgz
$ git commit -m 'add git tarball'
[master 7b30847] add git tarball
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 git.tgz
```

其实这个项目并不需要这个巨大的压缩文件。 现在我们将它移除：

```text
$ git rm git.tgz
rm 'git.tgz'
$ git commit -m 'oops - removed large tarball'
[master dadf725] oops - removed large tarball
 1 file changed, 0 insertions(+), 0 deletions(-)
 delete mode 100644 git.tgz
```

现在，我们执行 `gc` 来查看数据库占用了多少空间：

```text
$ git gc
Counting objects: 17, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (13/13), done.
Writing objects: 100% (17/17), done.
Total 17 (delta 1), reused 10 (delta 0)
```

你也可以执行 `count-objects` 命令来快速的查看占用空间大小：

```text
$ git count-objects -v
count: 7
size: 32
in-pack: 17
packs: 1
size-pack: 4868
prune-packable: 0
garbage: 0
size-garbage: 0
```

size-pack 的数值指的是你的包文件以 KB 为单位计算的大小，所以你大约占用了 5MB 的空间。在最后一次提交前，使用了不到 2KB — 显然，从之前的提交中移除文件并不能从历史中移除它。每一次有人克隆这个仓库时，他们将必须克隆所有的 5MB 来获得这个微型项目，只因为你意外地添加了一个大文件。现在来让我们彻底的移除这个文件

首先你必须找到它。在本例中，你已经知道是哪个文件了。但是假设你不知道；该如何找出哪个文件或哪些文件占用了如此多的空间？如果你执行 `git gc` 命令，所有的对象将被放入一个包文件中，你可以通过运行 `git verify-pack` 命令，然后对输出内容的第三列（即文件大小）进行排序，从而找出这个大文件。你也可以将这个命令的执行结果通过管道传送给 `tail` 命令，因为你只需要找到列在最后的几个大对象

```text
$ git verify-pack -v .git/objects/pack/pack-29…69.idx \
  | sort -k 3 -n \
  | tail -3
dadf7258d699da2c8d89b09ef6670edb7d5f91b4 commit 229 159 12
033b4468fa6b2a9547a70d88d1bbe8bf3f9ed0d5 blob   22044 5792 4977696
82c99a3e86bb1267b236a4b6eff7868d97489af1 blob   4975916 4976258 1438
```

你可以看到这个大对象出现在返回结果的最底部：占用 5MB 空间。为了找出具体是哪个文件，可以使用 `rev-list` 命令，我们在 [指定特殊的提交信息格式](#指定特殊的提交信息格式) 中曾提到过。如果你传递 `--objects` 参数给 `rev-list` 命令，它就会列出所有提交的 SHA-1、数据对象的 SHA-1 和与它们相关联的文件路径。可以使用以下命令来找出你的数据对象的名字：

```text
$ git rev-list --objects --all | grep 82c99a3
82c99a3e86bb1267b236a4b6eff7868d97489af1 git.tgz
```

现在，你只需要从过去所有的树中移除这个文件。使用以下命令可以轻松地查看哪些提交对这个文件产生改动：

```text
$ git log --oneline --branches -- git.tgz
dadf725 oops - removed large tarball
7b30847 add git tarball
```

现在，你必须重写 7b30847 提交之后的所有提交来从 Git 历史中完全移除这个文件。为了执行这个操作，我们要使用 `filter-branch` 命令，这个命令在 [重写历史](#重写历史) 中也使用过：

```text
$ git filter-branch --index-filter \
  'git rm --ignore-unmatch --cached git.tgz' -- 7b30847^..
Rewrite 7b30847d080183a1ab7d18fb202473b3096e9f34 (1/2)rm 'git.tgz'
Rewrite dadf7258d699da2c8d89b09ef6670edb7d5f91b4 (2/2)
Ref 'refs/heads/master' was rewritten
```

`--index-filter` 选项类似于在 [重写历史](#重写历史) 中提到的的 `--tree-filter` 选项，不过这个选项并不会让命令将修改在硬盘上检出的文件，而只是修改在暂存区或索引中的文件

你必须使用 `git rm --cached` 命令来移除文件，而不是通过类似 `rm file` 的命令 — 因为你需要从索引中移除它，而不是磁盘中。还有一个原因是速度 — Git 在运行过滤器时，并不会检出每个修订版本到磁盘中，所以这个过程会非常快。 如果愿意的话，你也可以通过 `--tree-filter` 选项来完成同样的任务。`git rm` 命令的 --ignore-unmatch 选项告诉命令：如果尝试删除的模式不存在时，不提示错误。最后，使用 `filter-branch` 选项来重写自 7b30847 提交以来的历史，也就是这个问题产生的地方。否则，这个命令会从最旧的提交开始，这将会花费许多不必要的时间

你的历史中将不再包含对那个文件的引用。不过，你的引用日志和你在 .git/refs/original 通过 `filter-branch` 选项添加的新引用中还存有对这个文件的引用，所以你必须移除它们然后重新打包数据库。在重新打包前需要移除任何包含指向那些旧提交的指针的文件：

```text
$ rm -Rf .git/refs/original
$ rm -Rf .git/logs/
$ git gc
Counting objects: 15, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (11/11), done.
Writing objects: 100% (15/15), done.
Total 15 (delta 1), reused 12 (delta 0)
```

让我们看看你省了多少空间

```text
$ git count-objects -v
count: 11
size: 4904
in-pack: 15
packs: 1
size-pack: 8
prune-packable: 0
garbage: 0
size-garbage: 0
```

打包的仓库大小下降到了 8K，比 5MB 好很多。可以从 size 的值看出，这个大文件还在你的松散对象中，并没有消失；但是它不会在推送或接下来的克隆中出现，这才是最重要的。如果真的想要删除它，可以通过有 `--expire` 选项的 `git prune` 命令来完全地移除那个对象：

```text
$ git prune --expire now
$ git count-objects -v
count: 0
size: 0
in-pack: 15
packs: 1
size-pack: 8
prune-packable: 0
garbage: 0
size-garbage: 0
```