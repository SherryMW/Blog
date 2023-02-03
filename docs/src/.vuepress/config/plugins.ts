import {PluginConfig} from 'vuepress'
import {containerPlugin} from '@vuepress/plugin-container'
import {renderProjects} from './projects'

export const configPlugins: PluginConfig = [
    containerPlugin({
        type: 'projects',
        render: (tokens, idx) => {
            return renderProjects(tokens, idx)
        }
    })
]