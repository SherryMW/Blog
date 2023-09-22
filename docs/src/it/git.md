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

事分两面，有好有坏。这么做最显而易见的缺点是中央服务器的单点故障。如果宕机一小时，那么在这一小时内，谁都无法提交更新，也就无法协同工作。如果中心数据库所在的磁盘发生损坏，又没有做恰当备份，毫无疑问你将丢失所有数据—包括项目的整个变更历史，只剩下人们在各自机器上保留的单独快照。本地版本控制系统也存在类似问题，只要整个项目的历史记录被保存在单一位置，就有丢失所有历史更新记录的风险

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

举个例子，要浏览项目的历史，Git 不需外连到服务器去获取历史，然后再显示出来—它只需直接从本地数据库中读取。你能立即看到项目历史。如果你想查看当前版本与一个月前的版本之间引入的修改，Git 会查找到一个月前的文件做一次本地的差异计算，而不是由远程服务器处理或从远程服务器拉回旧版本文件再来本地处理

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

如果你并不想保留对 CONTRIBUTING.md 文件的修改怎么办？你该如何方便地撤消修改—将它还原成上次提交时的样子（或者刚克隆完的样子，或者刚把它放入工作目录时的样子）？幸运的是，`git status` 也告诉了你应该如何做。在最后一个例子中，未暂存区域是这样：

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

可以看到那些修改已经被撤消了（请务必记得 `git checkout-<file>` 是一个危险的命令。你对那个文件在本地的任何修改都会消失—Git 会用最近提交的版本覆盖掉它。除非你确实清楚不想要对那个文件的本地修改了，否则请不要使用这个命令）

如果你仍然想保留对那个文件做出的修改，但是现在仍然需要撤消，我们将会在 [Git 分支](#git-分支) 介绍保存进度与分支，这通常是更好的做法

记住，在 Git 中任何 已提交的东西几乎总是可以恢复的。甚至那些被删除的分支中的提交或使用 `--amend` 选项覆盖的提交也可以恢复 （阅读 [数据恢复](#数据恢复) 了解数据恢复）。然而，任何你未提交的东西丢失后很可能再也找不到了

### 远程仓库的使用

为了能在任意 Git 项目上协作，你需要知道如何管理自己的远程仓库。远程仓库是指托管在因特网或其他网络中的你的项目的版本库。你可以有好几个远程仓库，通常有些仓库对你只读，有些则可以读写。与他人协作涉及管理远程仓库以及根据需要推送或拉取数据。管理远程仓库包括了解如何添加远程仓库、移除无效的远程仓库、管理不同的远程分支并定义它们是否被跟踪等等。在本节中，我们将介绍一部分远程管理的技能

注意：远程仓库可以在你的本地主机上（你完全可以在一个“远程”仓库上工作，而实际上它在你本地的主机上。词语“远程”未必表示仓库在网络或互联网上的其它位置，而只是表示它在别处。在这样的远程仓库上工作，仍然需要和其它远程仓库上一样的标准推送、拉取和抓取操作）

#### 查看远程仓库

如果想查看你已经配置的远程仓库服务器，可以运行 `git remote` 命令。它会列出你指定的每一个远程服务器的简写。如果你已经克隆了自己的仓库，那么至少应该能看到 `origin` —这是 Git 给你克隆的仓库服务器的默认名字：

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

现在 Paul 的 master 分支可以在本地通过 pb/master 访问到—你可以将它合并到自己的某个分支中，或者如果你想要查看它的话，可以检出一个指向该点的本地分支。（我们将会在 [Git 分支](#git-分支) 中详细介绍什么是分支以及如何使用分支）

#### 从远程仓库中抓取与拉取

就如刚才所见，从远程仓库中获得数据，可以执行：

```shell
$ git fetch <remote>
```

这个命令会访问远程仓库，从中拉取所有你还没有的数据。执行完成后，你将会拥有那个远程仓库中所有分支的引用，可以随时合并或查看

如果你使用 `clone` 命令克隆了一个仓库，命令会自动将其添加为远程仓库并默认以 “origin” 为简写。所以，`git fetch origin` 会抓取克隆（或上一次抓取）后新推送的所有工作。必须注意 `git fetch` 命令只会将数据下载到你的本地仓库—它并不会自动合并或修改你当前的工作。当准备好时你必须手动将其合并入你的工作

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

如果因为一些原因想要移除一个远程仓库—你已经从服务器上搬走了或不再想使用某一个特定的镜像了，又或者某一个贡献者不再贡献了—可以使用 `git remote remove` 或 `git remote rm` ：

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

轻量标签很像一个不会改变的分支—它只是某个特定提交的引用

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

另一种给提交打标签的方式是使用轻量标签。轻量标签本质上是将提交校验和存储到一个文件中—没有保存任何其他信息。创建轻量标签，不需要使用 `-a`、`-s` 或 `-m` 选项，只需要提供标签名字：

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

默认情况下，`git push` 命令并不会传送标签到远程仓库服务器上。在创建完标签后你必须显式地推送标签到共享服务器上。这个过程就像共享远程分支一样—你可以运行 `git push origin <tagname>`

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

几乎所有的版本控制系统都以某种形式支持分支。使用分支意味着你可以把你的工作从开发主线上分离开来，以免影响开发主线。在很多版本控制系统中，这是一个略微低效的过程—常常需要完全创建一个源代码目录的副本。对于大项目来说，这样的过程会耗费很多时间

有人把 Git 的分支模型称为它的“必杀技特性”，也正因为这一特性，使得 Git 从众多版本控制系统中脱颖而出。为何 Git 的分支模型如此出众呢？Git 处理分支的方式可谓是难以置信的轻量，创建新分支这一操作几乎能在瞬间完成，并且在不同分支之间的切换操作也是一样便捷。与许多其它版本控制系统不同，Git 鼓励在工作流程中频繁地使用分支与合并，哪怕一天之内进行许多次。理解和精通这一特性，你便会意识到 Git 是如此的强大而又独特，并且从此真正改变你的开发方式

为了真正理解 Git 处理分支的方式，我们需要回顾一下 Git 是如何保存数据的。或许你还记得[起步](#起步)的内容，Git 保存的不是文件的变化或者差异，而是一系列不同时刻的**快照**

在进行提交操作时，Git 会保存一个提交对象（commit object）。知道了 Git 保存数据的方式，我们可以很自然的想到—该提交对象会包含一个指向暂存内容快照的指针。 但不仅仅是这样，该提交对象还包含了作者的姓名和邮箱、提交时输入的信息以及指向它的父对象的指针。首次提交产生的提交对象没有父对象，普通提交操作产生的提交对象有一个父对象，而由多个分支合并产生的提交对象有多个父对象

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

现在，你已经决定要解决你的公司使用的问题追踪系统中的 #53 问题。想要新建一个分支并同时切换到那个分支上，你可以运行一个带有 -b 参数的 `git checkout` 命令：

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

在合并的时候，你应该注意到了“快进（fast-forward）”这个词。由于你想要合并的分支 hotfix 所指向的提交 C4 是你所在的提交 C2 的直接后继，因此 Git 会直接将指针向前移动。换句话说，当你试图合并两个分支时，如果顺着一个分支走下去能够到达另一个分支，那么 Git 在合并两者的时候，只会简单的将指针向前推进（指针右移），因为这种情况下的合并操作没有需要解决的分歧—这就叫做 “快进（fast-forward）”

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

许多使用 Git 的开发者都喜欢使用这种方式来工作，比如只在 master 分支上保留完全稳定的代码—有可能仅仅是已经发布或即将发布的代码。他们还有一些名为 develop 或者 next 的平行分支，被用来做后续开发或者测试稳定性—这些分支不必保持绝对稳定，但是一旦达到稳定状态，它们就可以被合并入 master 分支了。这样，在确保这些已完成的主题分支（短期分支，比如之前的 iss53 分支）能够通过所有测试，并且不会引入更多 bug 之后，就可以合并入主干分支中，等待下一次的发布

事实上我们刚才讨论的，是随着你的提交而不断右移的指针。稳定分支的指针总是在提交历史中落后一大截，而前沿分支的指针往往比较靠前

![趋于稳定分支的线性图](https://git-scm.com/book/en/v2/images/lr-branches-1.png)

通常把他们想象成流水线（work silos）可能更好理解一点，那些经过测试考验的提交会被遴选到更加稳定的流水线上去

![趋于稳定分支的流水线（“silo”）视图](https://git-scm.com/book/en/v2/images/lr-branches-2.png)

你可以用这种方法维护不同层次的稳定性。一些大型项目还有一个 proposed（建议）或 pu: proposed updates（建议更新）分支，它可能因包含一些不成熟的内容而不能进入 next 或者 master 分支。这么做的目的是使你的分支具有不同级别的稳定性；当它们具有一定程度的稳定性后，再把它们合并入具有更高级别稳定性的分支中。再次强调一下，使用多个长期分支的方法并非必要，但是这么做通常很有帮助，尤其是当你在一个非常庞大或者复杂的项目中工作时

#### 主题分支

主题分支对任何规模的项目都适用。主题分支是一种短期分支，它被用来实现单一特性或其相关工作。也许你从来没有在其他的版本控制系统（VCS）上这么做过，因为在那些版本控制系统中创建和合并分支通常很费劲。然而，在 Git 中一天之内多次创建、使用、合并、删除分支都很常见

你已经在上一节中你创建的 iss53 和 hotfix 主题分支中看到过这种用法。你在上一节用到的主题分支（iss53 和 hotfix 分支）中提交了一些更新，并且在它们合并入主干分支之后，你又删除了它们。这项技术能使你快速并且完整地进行上下文切换（context-switch）—因为你的工作被分散到不同的流水线中，在不同的流水线中每个分支都仅与其目标特性相关，因此，在做代码审查之类的工作的时候就能更加容易地看出你做了哪些改动。你可以把做出的改动在主题分支中保留几分钟、几天甚至几个月，等它们成熟之后再合并，而不用在乎它们建立的顺序或工作进度

考虑这样一个例子，你在 master 分支上工作到 C1，这时为了解决一个问题而新建 iss91 分支，在 iss91 分支上工作到 C4，然而对于那个问题你又有了新的想法，于是你再新建一个 iss91v2 分支试图用另一种方法解决那个问题，接着你回到 master 分支工作了一会儿，你又冒出了一个不太确定的想法，你便在 C10 的时候新建一个 dumbidea 分支，并在上面做些实验。你的提交历史看起来像下面这个样子：

![拥有多个主题分支的提交历史](https://git-scm.com/book/en/v2/images/topic-branches-1.png)

现在，我们假设两件事情：你决定使用第二个方案来解决那个问题，即使用在 iss91v2 分支中方案。另外，你将 dumbidea 分支拿给你的同事看过之后，结果发现这是个惊人之举。这时你可以抛弃 iss91 分支（即丢弃 C5 和 C6 提交），然后把另外两个分支合并入主干分支。最终你的提交历史看起来像下面这个样子：

![合并了 dumbidea 和 iss91v2 分支之后的提交历史](https://git-scm.com/book/en/v2/images/topic-branches-2.png)

我们将会在[分布式 Git](#分布式-git)中向你揭示更多有关分支工作流的细节， 因此，请确保你阅读完那个章节之后，再来决定你的下个项目要使用什么样的分支策略（branching scheme）

请牢记，当你做这么多操作的时候，这些分支全部都存于本地。当你新建和合并分支的时候，所有这一切都只发生在你本地的 Git 版本库中—没有与服务器发生交互

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

当你想要公开分享一个分支时，需要将其推送到有写入权限的远程仓库上。本地的分支并不会自动与远程仓库同步—你必须显式地推送想要分享的分支。这样，你就可以把不愿意分享的内容放到私人分支上，而将需要和别人协作的内容推送到公开分支

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

这里有些工作被简化了 Git 自动将 serverfix 分支名字展开为 refs/heads/serverfix:refs/heads/serverfix，那意味着，“推送本地的 serverfix 分支来更新远程仓库上的 serverfix 分支。”我们将会详细学习 Git 内部原理 的 refs/heads/ 部分，但是现在可以先把它放在儿。你也可以运行 `git push origin serverfix:serverfix`，它会做同样的事—也就是说“推送本地的 serverfix 分支，将其作为远程仓库的 serverfix 分支”可以通过这种格式来推送本地分支到一个命名不相同的远程分支。如果并不想让远程仓库上的分支叫做 serverfix，可以运行 `git push origin serverfix:awesomebranch`来将本地的 serverfix 分支推送到远程仓库上的 awesomebranch 分支

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

要特别注意的一点是当抓取到新的远程跟踪分支时，本地不会自动生成一份可编辑的副本（拷贝）。换一句话说，这种情况下，不会有一个新的 serverfix 分支—只有一个不可以修改的 origin/serverfix 指针

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

假设你已经通过远程分支做完所有的工作了—也就是说你和你的协作者已经完成了一个特性，并且将其合并到了远程仓库的 master 分支（或任何其他稳定代码分支）。可以运行带有 `--delete` 选项的 `git push` 命令来删除一个远程分支。如果想要从服务器上删除 serverfix 分支，运行下面的命令：

```text
$ git push origin --delete serverfix
To https://github.com/schacon/simplegit
 - [deleted]         serverfix
```

基本上这个命令做的只是从服务器上移除这个指针。Git 服务器通常会保留数据一段时间直到垃圾回收运行，所以如果不小心删除掉了，通常是很容易恢复的

## 服务器上的 Git

### 在服务器上搭建 Git

## 分布式 Git

### 分布式工作流程

## GitHub

## Git 工具

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

### 重置揭密

## 自定义 Git

## Git 与其他系统

## Git 内部原理

### 底层命令与上层命令

### 维护与数据恢复

#### 数据恢复