---
date: 2022-05-22
category: IT
---

# Git

Git 就像是程序员的时间机器，可以让你轻松穿越代码的时光

<!-- more -->

官网：[https://git-scm.com](https://git-scm.com/)

## Git 简介

Git 是一个分布式版本控制系统，用于管理和跟踪软件开发项目的代码变更

以下是 Git 的主要功能和用途：

1. 版本控制：Git 可以跟踪文件的修改、添加和删除等操作，并记录每个修改的历史。这使得开发人员可以轻松地回溯和恢复到任意时间点的代码状态

2. 多人协作：Git 允许多个开发人员同时在同一个项目上工作，并能够合并（merge）彼此的代码变更。它提供了分支（branch）的概念，允许开发人员在独立的分支上进行开发，并在完成后将其合并到主分支上

3. 分布式开发：Git 是一个分布式版本控制系统，每个开发人员都可以在自己的本地仓库中进行完整的版本控制操作。这意味着即使没有网络连接，开发人员仍然可以进行提交、回滚和浏览历史记录等操作

4. 提交和回滚：开发人员可以使用 Git 提交（commit）命令来保存代码的状态，并添加相关的注释信息。此外，Git 还支持回滚（revert）操作，可以撤销先前的提交，回到之前的代码状态

5. 分支管理：Git 提供了强大的分支管理功能，开发人员可以创建新的分支来独立开发某个功能或修复某个 bug，而不会影响主分支上的代码。分支可以合并回主分支，也可以删除不再需要的分支

6. 远程仓库协作：Git 可以与远程仓库（如 GitHub、GitLab、Bitbucket 等）进行交互，开发人员可以将本地的代码推送（push）到远程仓库，或者从远程仓库拉取（pull）最新的代码

7. 工作流支持：Git 支持多种工作流程和开发模型，如集中式工作流、分叉工作流、拉取请求（Pull Request）等，可以根据团队和项目的需求选择适合的工作流程

## Git 基本操作

### 删除文件

如果您只想删除 GitHub 远程仓库中的特定文件，而保留本地文件，可以按照以下步骤操作：

1. 首先，确保您的本地仓库与 GitHub 远程仓库同步。可以使用以下命令拉取最新的更改代码：

    ```shell
    git pull origin main
    ```

2. 接下来，您需要使用 `git rm` 命令删除不想提交的文件。运行以下命令，将要删除的文件逐个添加到索引中：

    ```shell
    git rm --cached 文件路径/文件名
    ```

    请替换 "文件路径/文件名" 为您要删除的文件的路径和名称。重复此步骤以删除所有需要删除的文件

    选项 `--cached` 表示仅将文件从暂存区中删除，而不会对工作目录中的实际文件进行任何操作。这样做的好处是，您可以保留本地文件的副本，但不会将它们包含在提交中。因此，当您运行 `git rm --cached` 文件路径/文件名 命令时，它将删除指定的文件的索引记录，但不会删除您的实际文件。这样您就可以保留本地文件，同时将其从 Git 提交中排除

    如果您想删除一个整个文件夹（包括文件夹内的所有文件和子文件夹），可以使用 `git rm` 命令的 `-r` 或 `--recursive` 选项。这样可以递归地删除文件夹及其内容

    ```shell
    git rm -r --cached 文件夹路径
    ```

3. 完成文件删除后，提交更改并推送到远程仓库：

    ```shell
    git commit -m "删除不需要的文件"
    git push origin main
    ```

---

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
    git rm -r --cached 文件路径
    ```

    这样，这些文件将被从索引中移除，但会保留在工作目录中
   
2. 如果您确定要删除这些文件并丢弃更改，可以使用 `-f` 选项来强制删除文件。请注意，这将不可恢复地删除这些文件的更改。命令如下：

    ```shell
    git rm -r -f 文件路径
    ```