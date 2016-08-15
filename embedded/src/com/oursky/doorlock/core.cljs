(ns com.oursky.doorlock.core
  (:require-macros [cljs.core.async.macros :refer [go-loop]])
  (:require [cljs.reader :refer [read-string]]
            [taoensso.timbre :as log]
            [cljs.core.async :refer [<! >! put! alts! chan timeout]]
            [cljs.nodejs :refer [require enable-util-print!]]
            ))

(def create-server (aget (require "http") "createServer"))
(def exec-sync (aget (require "child_process") "execSync"))

; unlock triggering channel
; identify the trigger source by sending {:source <source>}
(def unlock-chan (chan))

(defn -main [& args]
  ; setup GPIO via wiringpi CLI interface
  (exec-sync "gpio mode 0 up")
  (exec-sync "gpio mode 1 out")

  ; listen on unlock-chan for unlock events
  ; if a new unlock event is revieved before the 3000ms timeout, the door is kept open.
  (go-loop [unlock nil]
           (when unlock
             (exec-sync "gpio write 1 1")
             (loop [[trigger _] [unlock nil]]
               (when trigger
                 (log/info (str "Unlock triggered by " (:source trigger)))
                 (recur (alts! [unlock-chan (timeout 3000)]))))
             (exec-sync "gpio write 1 0")
             (log/info "Door Locked"))
           (recur (<! unlock-chan)))

  ; button event listener
  ; hold down for atleast 200ms to trigger
  ; will emit event every 25000ms if held down
  (go-loop []
           (if (= 1 (read-string (exec-sync "gpio read 0" #js{:encoding "utf8"})))
             (exec-sync "gpio wfi 0 falling")
             (<! (timeout 2500)))
           (<! (timeout 200))
           (when (= 0 (read-string (exec-sync "gpio read 0" #js{:encoding "utf8"})))
             (>! unlock-chan {:source :button}))
           (recur))

  ; http event listener
  (.listen
    (create-server
      (fn [req res]
        (put! unlock-chan {:source (or (get-in req ["headers" "x-source"]) :network)})
        (.end res)))
    8090 "127.0.0.1")

  (log/info "=== Daemon Started ==="))

(enable-util-print!)
(set! *main-cli-fn* -main)
