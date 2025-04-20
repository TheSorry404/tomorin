<template>
  <div class="chat-container">
    <div class="chat-box">
      <button class="close-button" @click="hideChatBox">×</button>

      <div class="message-container" v-if="conversation.userMessage || conversation.aiResponse">
        <div class="user-message" v-if="conversation.userMessage">
          <div class="message-bubble user">
            <p>{{ conversation.userMessage }}</p>
          </div>
        </div>
        <div class="ai-message" v-if="conversation.aiResponse">
          <div class="message-bubble ai">
            <p>{{ conversation.aiResponse }}</p>
          </div>
        </div>
      </div>
      <div class="input-container">
        <input
          type="text"
          v-model="userInput"
          placeholder="请输入消息..."
          @keyup.enter="sendMessage"
          class="message-input"
        />
        <button @click="sendMessage" class="send-button">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatBox',
  props: {
    // 可以通过props传入自定义的AI响应函数
    getAiResponse: {
      type: Function,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userInput: '',
      conversation: {
        userMessage: '',
        aiResponse: '',
      },
      isLoading: false,
    }
  },
  methods: {
    // 发送消息
    sendMessage() {
      if (!this.userInput.trim()) return

      // 清空之前的对话，只保留当前一轮
      this.conversation = {
        userMessage: this.userInput,
        aiResponse: '',
      }

      this.isLoading = true

      // 使用传入的AI响应函数或默认的模拟函数
      const aiResponseFunction = this.getAiResponse || this.mockAiResponse

      // 获取AI响应
      aiResponseFunction(this.userInput)
        .then((response) => {
          this.conversation.aiResponse = response
        })
        .catch((error) => {
          console.error('获取AI响应失败:', error)
          this.conversation.aiResponse = '抱歉，我暂时无法回答您的问题。'
        })
        .finally(() => {
          this.isLoading = false
          this.userInput = '' // 清空输入框
        })
    },

    // 模拟AI响应函数（如果没有提供自定义函数）
    mockAiResponse(message) {
      return new Promise((resolve) => {
        // 模拟网络延迟
        setTimeout(() => {
          // 简单的模拟回复逻辑
          const responses = [
            `您好，我收到了您的消息："${message}"。我是一个模拟的AI助手。`,
            `感谢您的提问："${message}"。这是一个模拟的回答。`,
            `关于"${message}"，我需要更多信息才能给您详细解答。`,
            `我理解您想了解关于"${message}"的信息，请允许我为您解答...`,
          ]
          const randomIndex = Math.floor(Math.random() * responses.length)
          resolve(responses[randomIndex])
        }, 1000)
      })
    },

    // 显示聊天框的函数，可以被父组件调用
    showChatBox() {
      // 可以在这里添加显示聊天框的逻辑
      // 例如修改CSS类或状态变量
      this.$el.style.display = 'block'
    },

    // 隐藏聊天框的函数，可以被父组件调用
    hideChatBox() {
      // 可以在这里添加隐藏聊天框的逻辑
      this.$el.style.display = 'none'
    },

    // 清空对话的函数，可以被父组件调用
    clearConversation() {
      this.conversation = {
        userMessage: '',
        aiResponse: '',
      }
      this.userInput = ''
    },
  },
}
</script>

<style scoped>
.close-button {
  position: relative;
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: none;
  color: #666;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  margin-left: auto;
  margin-right: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-button:hover {
  opacity: 1;
}
.chat-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  /* padding: 0 10px 10px; */
  box-sizing: border-box;
}

.chat-box {
  background-color: #f5f5f5;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 600px;
  margin: 0 auto;
  padding: 15px;
}

.message-container {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
  padding: 10px 0;
}

.user-message,
.ai-message {
  margin-bottom: 12px;
  display: flex;
}

.user-message {
  justify-content: flex-end;
}

.ai-message {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-break: break-word;
}

.message-bubble.user {
  background-color: #007aff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble.ai {
  background-color: white;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message-bubble p {
  margin: 0;
  line-height: 1.4;
}

.input-container {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 24px;
  padding: 4px 6px 10px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 0;
  font-size: 16px;
  background: transparent;
}

.send-button {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  margin-left: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #0062cc;
}

.send-button:active {
  background-color: #004999;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chat-box {
    border-radius: 12px 12px 0 0;
    padding: 10px;
  }

  .message-bubble {
    max-width: 85%;
    padding: 8px 12px;
  }

  .input-container {
    padding: 3px 5px 3px 12px;
    margin-bottom: 20px;
  }

  .message-input {
    font-size: 14px;
  }

  .send-button {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>
