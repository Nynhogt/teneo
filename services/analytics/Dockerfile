FROM golang:1.24-alpine AS builder
WORKDIR /src
COPY go.mod main.go ./
RUN CGO_ENABLED=0 go build -o /analytics .

FROM alpine:3.21
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /analytics /analytics
USER app
EXPOSE 8080
ENTRYPOINT ["/analytics"]
