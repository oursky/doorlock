(ns com.oursky.doorlock.core
  (:require [taoensso.timbre :as log]
            [gpio.core :refer [open-port open-channel-port write-value! toggle!]]
            [clojure.java.shell :refer [sh]]
            [clojure.core.async :refer [<! go-loop timeout]]
            ))

; setup GPIO via wiringpi CLI interface
; the clj-gpio library does not support internal pull-up
(sh "gpio" "mode" "0" "up")
(sh "gpio" "mode" "1" "out")

(def button-chan (open-channel-port 0))
(def unlock-port (open-port 1))

(go-loop
  []
  (<! (timeout 2000))
  (toggle! unlock-port)
  (recur))

(go-loop
  []
  (log/info (<! button-chan))
  (recur))

(log/info "=== Daemon Started ===")
